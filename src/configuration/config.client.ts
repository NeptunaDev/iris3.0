'use client';

// En el cliente, Next.js reemplaza esto durante el build
const URI_API = process.env.NEXT_PUBLIC_URI_API;

if (!URI_API) {
  console.error('NEXT_PUBLIC_URI_API is not defined. Please check your .env file');
}

export { URI_API }; 