"use server"; // Marca estas funciones como Server Actions

import prisma from "@/lib/prisma";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

// ==========================================
// 1. REGISTRO DE COMPRADOR (BUYER)
// ==========================================
export async function registerBuyer(formData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  try {
    const { name, email, password, phone } = formData;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "El correo electrónico ya está registrado.",
      };
    }

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario Comprador
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        role: "BUYER",
      },
    });

    //  Crear cookie de sesión automática
    await createSession({
      userId: newUser.id,
      role: newUser.role as "BUYER" | "SELLER" | "ADMIN",
      email: newUser.email,
    });

    return {
      success: true,
      message: "Comprador registrado exitosamente.",
      userId: newUser.id,
    };
  } catch (error) {
    console.error("Error en registerBuyer:", error);
    return {
      success: false,
      error: "Ocurrió un error al registrar el usuario.",
    };
  }
}

// ==========================================
// 2. REGISTRO DE PROVEEDOR / EMPRESA (SELLER)
// ==========================================
export async function registerSeller(formData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  rfc?: string;
}) {
  try {
    const { name, email, password, phone, companyName, rfc } = formData;

    // Verificar si el correo ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "El correo electrónico ya está registrado.",
      };
    }

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear la empresa y el usuario administrador en una sola transacción
    const newCompany = await prisma.company.create({
      data: {
        legalName: companyName,
        rfc: rfc || null,
        users: {
          create: {
            name,
            email,
            passwordHash,
            phone,
            role: "SELLER",
          },
        },
      },
      include: {
        users: true,
      },
    });

    const createdUser = newCompany.users[0];

    //  Crear cookie de sesión automática
    await createSession({
      userId: createdUser.id,
      role: createdUser.role as "BUYER" | "SELLER" | "ADMIN",
      email: createdUser.email,
    });

    return {
      success: true,
      message: "Proveedor y Empresa registrados exitosamente.",
      companyId: newCompany.id,
    };
  } catch (error) {
    console.error("Error en registerSeller:", error);
    return {
      success: false,
      error: "Ocurrió un error al registrar la empresa proveedora.",
    };
  }
}

// ==========================================
// 3. INICIO DE SESIÓN (LOGIN)
// ==========================================
export async function loginUser(formData: { email: string; password: string }) {
  try {
    const { email, password } = formData;

    // Buscar al usuario por correo
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user || !user.passwordHash) {
      return { success: false, error: "Credenciales incorrectas." };
    }

    // Verificar si la contraseña coincide
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return { success: false, error: "Credenciales incorrectas." };
    }

    //  Guardar la cookie de sesión
    await createSession({
      userId: user.id,
      role: user.role as "BUYER" | "SELLER" | "ADMIN",
      email: user.email,
    });

    return {
      success: true,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
          ? { id: user.company.id, name: user.company.legalName }
          : null,
      },
    };
  } catch (error) {
    console.error("Error en loginUser:", error);
    return { success: false, error: "Error al iniciar sesión." };
  }
}

// ==========================================
// 4. CERRAR SESIÓN (LOGOUT)
// ==========================================
export async function logoutUser(redirectTo: string = "/login_usuario") {
  const cookieStore = await cookies();

  // Eliminamos la cookie especificando el path raíz
  cookieStore.delete({
    name: "session",
    path: "/",
  });

  // Redirigimos a la pantalla deseada (login de usuario o proveedor)
  redirect(redirectTo);
}

// ==========================================
// 5. OLVIDAR CONTRASEÑA
// ==========================================
const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "El correo electrónico es requerido." };
  }

  // 1. Verificar si el correo existe en la BD (Usuario Comprador o Vendedor)
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Nota de seguridad: si no existe, redirigimos igual o mostramos éxito para evitar enumeración de correos
  if (user) {
    // 2. Generar un código aleatorio de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Limpiar tokens anteriores de este email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Guardar el nuevo código
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: code,
        expiresAt,
      },
    });

    // 3. Enviar el correo electrónico con Resend
    try {
      await resend.emails.send({
        from: "Dixema <onboarding@resend.dev>",
        to: email,
        subject: "Tu código de verificación - Dixema",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Restablecer Contraseña</h2>
            <p>Hola, recibimos una solicitud para restablecer la contraseña de tu cuenta en Dixema.</p>
            <p>Tu código de verificación es:</p>
            <h1 style="color: #6366f1; letter-spacing: 5px;">${code}</h1>
            <p>Este código expira en 15 minutos.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      return { error: "No se pudo enviar el correo de verificación." };
    }
  }

  // 4. Redirigir a la vista del código pasando el email como query param
  redirect(`/codigo_verificacion?email=${encodeURIComponent(email)}`);
}
// ==========================================
// 6. CODIGO DE VERIFICACIÓN
// ==========================================
export async function verifyPasswordResetCode(email: string, code: string) {
  if (!email || !code) {
    return { error: "Correo y código son requeridos." };
  }

  // Buscamos el token en la base de datos
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      token: code,
    },
  });

  if (!resetToken) {
    return { error: "El código ingresado es incorrecto." };
  }

  // Verificamos que no haya expirado
  if (new Date() > new Date(resetToken.expiresAt)) {
    return { error: "El código ha expirado. Por favor solicita uno nuevo." };
  }

  return { success: true };
}

/**
 * Acción para actualizar la contraseña.
 * ¡Ojo! He puesto 'password', si en tu schema.prisma dice 'contrasena',
 * cambia la palabra abajo donde dice data: { ... }
 */
export async function updatePassword(
  email: string,
  code: string,
  newPassword: string,
) {
  try {
    if (!email || !code || !newPassword) {
      return { error: "Datos incompletos." };
    }

    // 1. Validar el token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { email, token: code },
    });

    if (!resetToken || new Date() > new Date(resetToken.expiresAt)) {
      return { error: "El código es inválido o ha expirado." };
    }

    // 2. Encriptar la nueva clave
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. ACTUALIZACIÓN (Aquí es donde estaba el error)
    // REGLA: prisma.user (en minúscula) -> data: { nombre_del_campo_en_schema: valor }
    await prisma.user.update({
      where: { email: email },
      data: {
        passwordHash: hashedPassword, // SI TE MARCA ROJO AQUÍ: cámbialo a 'contrasena' o como se llame en tu schema.
      },
    });

    // 4. Limpiar tokens usados
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    return { success: true };
  } catch (error) {
    console.error("Error en updatePassword:", error);
    return { error: "No se pudo actualizar la contraseña." };
  }
}
