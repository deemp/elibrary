import * as appbar from './AppBar'

export function Book({ bookId }: { bookId: number }) {
  const prefix = import.meta.env.VITE_API_PREFIX
  return (
    <iframe
      id="reader"
      src={`${prefix}/static/pdfjs/web/viewer.html?file=${prefix}/book/${bookId}/file`}
      style={{ marginTop: appbar.height }}
    />
  );
}
