import { motion } from "framer-motion";
import PasswordInput from "../ui/PasswordInput";

type FormFieldProps = {
  label: string;
  type: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  index: number;
  placeholder?: string;
};

export default function FormField({
  label,
  type,
  name,
  value = "",
  onChange,
  required = true,
  index,
  placeholder = "",
}: FormFieldProps) {
  // Fonction pour gérer les changements dans les champs de formulaire standard
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === "password" ? (
        <PasswordInput
          name={name}
          label={label}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="mt-1"
        />
      ) : (
        <div
          className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                      after:bg-gray-500 after:w-0 after:transition-all after:duration-300
                      focus-within:after:w-full before:absolute before:bottom-0 before:left-0 
                      before:w-full before:h-[1px] before:bg-gray-300"
        >
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={handleInputChange}
            required={required}
            placeholder={placeholder}
            className="pl-3 pr-3 w-full h-11 border-none outline-none
                     transition-all duration-200"
          />
        </div>
      )}
    </motion.div>
  );
}
