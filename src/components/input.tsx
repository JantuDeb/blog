import * as React from "react"
import { cn } from "lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, showPasswordToggle, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    function togglePasswordVisibility() {
      setShowPassword((prevShowPassword) => !prevShowPassword)
    }

    return (
      <div className="relative  w-full">
        <input
          type={type === "password" ? (showPassword ? "text" : type) : type}
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ",
            className
          )}
          ref={ref}
          {...props}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className="absolute text-sm inset-y-0 right-0 flex items-center px-3 focus:outline-none"
            onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
