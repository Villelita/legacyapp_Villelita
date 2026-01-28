import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const mongoVars = Object.keys(process.env)
    .filter(key => 
      key.includes('MONGO') || 
      key.includes('DATABASE') || 
      key.includes('DB') ||
      key.includes('URI')
    )
    .reduce((obj, key) => {
      const value = process.env[key];
      // Mostrar solo los primeros y últimos caracteres por seguridad
      if (value) {
        const masked = value.length > 20 
          ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
          : '***';
        obj[key] = `Configurada (${masked})`;
      } else {
        obj[key] = 'NO CONFIGURADA';
      }
      return obj;
    }, {} as Record<string, string>);

  const mongoUriExists = !!process.env.MONGODB_URI;
  const mongoUriLength = process.env.MONGODB_URI?.length || 0;

  return NextResponse.json({
    message: 'Variables de entorno relacionadas con MongoDB',
    mongoDbUri: {
      existe: mongoUriExists,
      longitud: mongoUriLength,
      configurada: mongoUriExists ? 'SÍ' : 'NO'
    },
    variablesEncontradas: mongoVars,
    totalVariables: Object.keys(process.env).length,
    instrucciones: mongoUriExists 
      ? 'MONGODB_URI está configurada. Si aún tienes problemas, verifica los logs de Render.'
      : 'MONGODB_URI NO está configurada. Ve a Render Dashboard > Environment y agrega la variable MONGODB_URI con tu cadena de conexión de MongoDB Atlas.'
  });
}
