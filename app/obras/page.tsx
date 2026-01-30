import WorksClient from "../components/WorksClient";

export default function GalleryPage() {
  const obras = getAllWorks();

  return (
    <main className="min-h-screen flex flex-col items-center bg-white p-8 md:p-24">
      <header className="w-full max-w-3xl mb-16 flex flex-col items-center">
        <img
          src="/obras.png"
          alt="Obras Título"
          className="w-full h-auto object-contain drop-shadow-xl mb-10"
        />
      </header>

      <WorksClient initialData={obras} />
    </main>
  );
}
function getAllWorks() {
  throw new Error("Function not implemented.");
}
