import { useTheme } from "../../hooks/useTheme";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`border-t px-4 py-8 ${
        isDark
          ? "bg-slate-950 border-slate-800 text-slate-400"
          : "bg-white border-slate-200 text-slate-600"
      }`}
    >
      <div className="mx-auto max-w-7xl text-center text-sm">
        © {new Date().getFullYear()} AI Product Assistant. All rights reserved.
      </div>
    </footer>
  );
}