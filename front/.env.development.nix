{ host, portFront, portBack, prefix }:
{
  VITE_API_PREFIX = prefix;
  VITE_API_BASE_URL = "http://${host}:${portBack}";
  NODE_ENV = "development";
  HOST = host;
  PORT_FRONT = portFront;
}
