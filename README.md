# 📄 Manda Remito [](https://github.com/leoogomez7/manda-remito#-manda-remito)

**Manda Remito** es una herramienta web moderna diseñada para agilizar la generación, gestión y envío de remitos y facturas comerciales. La plataforma ofrece una interfaz intuitiva para administrar comprobantes digitales, optimizar procesos de cobranza/entrega y mejorar la experiencia operativa de comercios y profesionales.

🌐 **Sitio Web Oficial:** [manda-factura.vercel.app](https://manda-factura.vercel.app/)

---

# 💡 ¿No eres programador? Te lo explicamos en simple

Si no tienes experiencia en informática o desarrollo de software, aquí te explicamos fácilmente de qué trata esta aplicación:

- **¿De qué se trata la página?**: Es un sistema en línea que te ayuda a crear, organizar y enviar remitos y facturas comerciales de manera rápida, ordenada y digital desde cualquier navegador.
- **¿Para qué sirve?**: Evita el uso del papel y los cálculos manuales. Permite ingresar los datos de tus clientes y productos para generar comprobantes listos para enviar o imprimir en pocos clics.
- **¿Por qué es rápida e interactiva?**: Funciona con tecnología web avanzada que calcula montos, aplica formatos y actualiza los comprobantes al instante, sin tener que esperar a que la página cargue de nuevo con cada cambio.
- **¿Cómo se ve en celulares?**: Está totalmente adaptada para pantallas táctiles, por lo que puedes crear o consultar tus remitos tanto desde tu teléfono móvil como desde una computadora o tablet.

---

# 🚀 ¿Qué es Manda Remito? [](https://github.com/leoogomez7/manda-remito#-qu%C3%A9-es-manda-remito)

Esta plataforma actúa como un centro de gestión de comprobantes comerciales enfocado en la eficiencia operativa. Está diseñada con una arquitectura ligera y de alta velocidad que incluye las siguientes características:

- **Generación Dinámica de Comprobantes**: Creación y edición ágil de remitos y facturas con cálculos automáticos de montos y totales.
- **Exportación y Envío Rápido**: Formato optimizado para visualización, impresión y gestión digital de archivos.
- **Interfaz Fluida e Intuitiva**: Diseño limpio que elimina pasos innecesarios para agilizar la carga de datos por parte del usuario.
- **Diseño Responsive & Mobile-First**: Adaptabilidad total para operar desde dispositivos móviles en el punto de venta o en movimiento.
- **Infraestructura Edge**: Despliegue global en redes de baja latencia para garantizar disponibilidad constante e inmediata.

---

# 🛠️ Stack Tecnológico [](https://github.com/leoogomez7/manda-remito#%EF%B8%8F-stack-tecnol%C3%B3gico)

El proyecto está desarrollado sobre un entorno frontend moderno, modular y de tipado seguro para garantizar una gestión de datos precisa y libre de errores.

### Frontend & UI [](https://github.com/leoogomez7/manda-remito#frontend--ui)
- **React.js & TypeScript**: Lógica de cliente robusta y tipado estático seguro para el manejo de estructuras comerciales.
- **Vite.js**: Entorno de desarrollo ultrarrápido y empaquetado optimizado para producción.
- **Tailwind CSS**: Framework de utilidades para un diseño moderno, ágil y totalmente adaptativo.
- **shadcn/ui & Lucide Icons**: Sistema de componentes e iconografía clara para formularios y tablas de datos.

### Entorno de Ejecución & Dependencias [](https://github.com/leoogomez7/manda-remito#entorno-de-ejecuci%C3%B3n--dependencias)
- **Bun**: Gestor de paquetes eficiente y motor de ejecución optimizado para agilizar el flujo de trabajo.
- **Node.js & NPM**: Base estándar del ecosistema para la ejecución de scripts.

### Calidad de Código [](https://github.com/leoogomez7/manda-remito#calidad-de-c%C3%B3digo)
- **ESLint**: Linter para análisis estático y cumplimiento de buenas prácticas.
- **Prettier**: Formateador automático para mantener un código limpio y consistente.

### Infraestructura & Cloud [](https://github.com/leoogomez7/manda-remito#infraestructura--cloud)
- **Vercel Edge Network**: Alojamiento en red perimetral global para máxima velocidad de carga y alta disponibilidad.

---

# ⚙️ Requisitos Previos [](https://github.com/leoogomez7/manda-remito#%EF%B8%8F-requisitos-previos)

Se recomienda contar con **Bun** instalado en tu entorno local para la gestión de dependencias:

```bash
# Comando de instalación de Bun (macOS/Linux/WSL)
curl -fsSL [https://bun.sh](https://bun.sh) | bash

🚀 Instalación y Uso Local 
Clonar el repositorio:

Bash
git clone [https://github.com/leoogomez7/manda-remito.git](https://github.com/leoogomez7/manda-remito.git)
cd manda-remito
Instalar dependencias:

Bash
bun install
Ejecutar el servidor local de desarrollo:

Bash
bun run dev
Compilar el proyecto para producción:

Bash
bun run build
📁 Estructura del Proyecto 
Plaintext
├── public/              # Archivos estáticos (plantillas, logos, favicons)
├── src/                 # Código fuente de la aplicación
│   ├── assets/          # Recursos gráficos y multimedia
│   ├── components/      # Componentes UI (formularios de remito, tablas, vista previa)
│   └── App.tsx          # Punto de entrada principal de la aplicación React
├── .gitignore           # Archivos omitidos por el control de versiones
├── .prettierrc          # Reglas del formateador de estilo
├── eslint.config.js     # Configuración de linting y reglas del código
├── index.html           # Documento raíz HTML5
├── package.json         # Scripts de ejecución y dependencias del proyecto
├── tsconfig.json        # Configuración del compilador TypeScript
└── vite.config.ts       # Configuración del empaquetador Vite
