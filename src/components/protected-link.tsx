import { Link } from "@tanstack/react-router";
import type { ComponentProps, MouseEvent } from "react";

const PROTECTED_PATH = "/nueva";
const PASSWORD = import.meta.env.VITE_PASSWORD;

type ProtectedLinkProps = ComponentProps<typeof Link>;

export function ProtectedLink({ onClick, to, ...props }: ProtectedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (to === PROTECTED_PATH) {
      const password = window.prompt("Ingrese la contraseña para crear un nuevo remito:");
      if (password !== PASSWORD) {
        event.preventDefault();
        window.alert("Contraseña incorrecta.");
        return;
      }
    }

    if (onClick) {
      onClick(event as any);
    }
  };

  return <Link to={to} onClick={handleClick} {...props} />;
}
