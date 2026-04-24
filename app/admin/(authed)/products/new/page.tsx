import { AdminProductForm } from "@/components/AdminProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        New Product
      </h1>
      <AdminProductForm />
    </div>
  );
}
