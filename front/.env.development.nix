{ host, port, prefix }:
{
  VITE_API_PREFIX = prefix;
  VITE_API_BASE_URL = "http://${host}:${port}";
}
