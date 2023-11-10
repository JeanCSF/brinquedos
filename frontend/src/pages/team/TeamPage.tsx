import { useEffect, useState } from "react";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb";
import IMGJeanC from "./JeanC.jfif";
import IMGLucasS from "./LucasS.jpg";
import IMGLucasP from "./LucasP.jpg";
import IMGLuan from "./Luan.jpg";
import IMGMatheus from "./Matheus.jpg";
import IMGGuilhemre from "./Guilherme.jpg";
import IMGJuan from "./Juan.jpg";
import IMGJeanA from "./JeanA.jpg";

interface TeamMember {
    name: string;
    rgm: string;
    image: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Jean Carlos de Santana Ferreira",
        rgm: "29499798",
        image: IMGJeanC
    },
    {
        name: "Lucas Santana Feitosa",
        rgm: "28637747",
        image: IMGLucasS,
    },
    {
        name: "Lucas Pereira dos Santos",
        rgm: "29896070",
        image: IMGLucasP,
    },
    {
        name: "Luan Santos da Silva",
        rgm: "29729807",
        image: IMGLuan,
    },
    {
        name: "Matheus Jorge Laurente",
        rgm: "☆2022 - ✞2023",
        image: IMGMatheus,
    },
    {
        name: "Guilherme Cardoso Santos",
        rgm: "29891108",
        image: IMGGuilhemre,
    },
    {
        name: "Juan Ramon Pavez Silva",
        rgm: "29964555",
        image: IMGJuan,
    },
    {
        name: "Jean Alves da Silva",
        rgm: "29547962",
        image: IMGJeanA,
    },
];

teamMembers.sort((a, b) => a.name.localeCompare(b.name));

const TeamPage: React.FC = () => {
    const paths = [
        { name: "Home", path: "/" },
        { name: "Sobre a Equipe", path: "/team" },
    ];
    const [clicks, setClicks] = useState(0);
    const [showMatheus, setShowMatheus] = useState(false);

    useEffect(() => {
        if (clicks >= 5) {
            setShowMatheus(true);
        }
    }, [clicks]);

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = () => {
        setClicks((prevClicks) => prevClicks + 1);
    };
    return (
        <div className="container">
            <BreadCrumb paths={paths} />
            <h1 className="text-3xl font-semibold text-center mb-6">Data Table</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className={`bg-white shadow-md rounded-lg p-4 flex flex-col items-center ${member.name === "Matheus Jorge Laurente" ? (showMatheus ? "block hover:translate-x-full" : "hidden") : "block"}`}
                    >
                        <div className="relative w-52 h-52 mx-auto">
                            <img src={member.image} alt={member.name} className="object-cover w-full h-full rounded-full" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
                        <p className="text-gray-500 text-lg">{`${member.name === "Matheus Jorge Laurente" ? member.rgm : "RGM: " + member.rgm}`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPage;
