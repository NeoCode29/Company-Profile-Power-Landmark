import Link from "next/link";

export default function FinishPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600">Pembayaran Berhasil 🎉</h1>
        <p className="text-gray-700 mt-2">
          Terima kasih! Pembayaran Anda telah berhasil diproses.
        </p>
        <Link href="/" className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
