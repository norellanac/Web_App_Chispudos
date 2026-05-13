const env = import.meta.env.MODE || 'development'; // Usa el entorno de Vite
const version = import.meta.env.VITE_APP_VERSION || '1.0.0'; // Usa la variable de entorno de Vite

let email = ''; // Inicializa como una variable mutable
let userId = ''; // Inicializa como una variable mutable

export const LOGGER_EVENTS = {
  ROUTING: 'routing' as const,
  ERROR: 'error' as const,
  DEBUG: 'debug' as const,
  INFO: 'info' as const,
};

export type LogLevel = 'routing' | 'error' | 'debug' | 'info';

export async function logger(
  event: LogLevel = 'debug',
  payload: any,
  moduleName = '',
  device = '',
  httpRequestDetails: { method?: string; url?: string; statusCode?: number; responseTime?: number } = {}
) {


  const httpRequestMessage = httpRequestDetails.method
    ? [
        `HTTP Method: ${httpRequestDetails.method}`,
        `URL: ${httpRequestDetails.url}`,
        `Status Code: ${httpRequestDetails.statusCode}`,
        `Response Time: ${httpRequestDetails.responseTime}ms`,
      ].join(' | ')
    : '';

  const logMessage = [
    `Log: ${formattedMessage(payload)}`,
    `User email: ${email || 'N/A'}`,
    `User ID: ${userId}`,
    `Environment: ${env}`,
    `Module: ${moduleName}`,
    `Version: ${version}`,
    `Device: ${device}`,
    httpRequestMessage,
  ].join(' | ');

  console.error(`== ${event} : ${logMessage}`);

  console[event === 'error' ? 'warn' : 'log'](`== ${event} : ${logMessage}`);

  if (env === 'production') {
    await fetch('https://api.example.com/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: logMessage,
        email: email,
        userId: userId,
        environment: env,
        module: moduleName,
        version: version,
        device: device,
        httpRequestDetails,
      }),
    });
  }
}

function formattedMessage(payload: any): string {
  if (payload instanceof Error) {
    return `Error: ${payload.message}\nStack: ${payload.stack}`;
  }
  switch (typeof payload) {
    case 'string':
      return payload;
    case 'number':
    case 'boolean':
      return payload.toString();
    case 'object':
      if (payload === null) {
        return 'null';
      }
      try {
        return JSON.stringify(payload, null, 2);
      } catch (error) {
        return 'Circular reference in payload';
      }
    default:
      return `Unsupported type: ${typeof payload}`;
  }
}

// Funciones para establecer la información del usuario globalmente
export function setUserInfo(userEmail: string, userIdentifier: string) {
  email = userEmail;
  userId = userIdentifier;
}

// Shortcut methods to match expected usage
// @ts-ignore
logger.info = (message: string, payload?: any) => logger('info', { message, payload });
// @ts-ignore
logger.error = (message: string, payload?: any) => logger('error', { message, payload });
// @ts-ignore
logger.debug = (message: string, payload?: any) => logger('debug', { message, payload });
