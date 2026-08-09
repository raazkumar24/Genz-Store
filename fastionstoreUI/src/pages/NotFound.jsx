import { Link } from "react-router-dom";
import { Badge, Button, BackButton } from "../components/ui";

const NotFound = () => {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none whitespace-nowrap z-0">
                <h1 className="text-[30vw] font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
                    404
                </h1>
            </div>

            <div className="relative z-10 max-w-2xl flex flex-col items-center">
                <Badge variant="error" className="mb-6 inline-flex px-6 py-2">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse mr-2"></span>
                    System Error
                </Badge>
                
                <h1 className="mt-4 text-6xl md:text-8xl font-black uppercase tracking-tight text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                    DROP<br/>NOT<br/>FOUND
                </h1>
                
                <p className="mt-6 text-sm font-medium text-gray-500 max-w-md mx-auto">
                    The page you are looking for has been sold out, moved, or never existed in the first place.
                </p>
                
                <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                    <BackButton size="lg" text="Go Back" />
                    <Button to="/" variant="primary" size="lg">
                        Return to Base
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
