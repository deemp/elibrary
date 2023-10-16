import * as appbar from '../models/appbar'

export function Book({ bookId }: { bookId: number }) {
  return (
    <iframe
      id="reader"
      src={`/pdfjs/web/viewer.html?file=${
        import.meta.env.VITE_API_PREFIX
      }/book/${bookId}/file`}
      style={{ marginTop: appbar.height }}
    />
  );
}
