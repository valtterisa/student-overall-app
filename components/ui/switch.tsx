import { motion } from "framer-motion";

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer bg-gray-300`}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        className="bg-white w-4 h-4 rounded-full shadow-md"
        animate={{ x: checked ? 20 : 0 }}
      />
    </div>
  );
}
