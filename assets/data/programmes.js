import {
  FaFlask,
  FaBrain,
  FaChartLine,
  FaLandmark,
  FaUsers,
  FaLanguage,
  FaBook,
  FaCalculator,
} from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { MdOutlineComputer } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { FaQuran } from "react-icons/fa";

const bsProgrammes = [
  {
    id: 1,
    course: "School of Islamic Revealed Knowledge",
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & Arts",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in Arabic",
    ],
    icon: <FaBook className="text-3xl text-blue-600" />,
  },
  {
    id: 2,
    course: " School of Social Science and Civilization",
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & in Social Science and Islamic Civilization",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in History, Sociology, Politics",
    ],
    icon: <FaLandmark className="text-3xl text-purple-600" />,
  },
  {
    id: 3,
    course: " School of Quranic Studies and Arts",
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & Quranic Studies and Arts",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree  Humanities / Arts (Subject to selection)",
    ],
    icon: <FaQuran className="text-3xl text-green-600" />,
  },
  {
    id: 4,
    course: " School of Finance and Management",
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & Islamic Finance and Management Studies",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in Commerce, Business Administration(BBA)",
    ],
    icon: <TbReportMoney className="text-3xl text-yellow-600" />,
  },
  {
    id: 5,
    course: " School of Language and Literature",
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & Language and Literature",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in English, Arabic, Urdu",
    ],
    icon: <FaLanguage className="text-3xl text-red-600" />,
  },
  {
    id: 6,
    course: "School of Pure Science and Technology",
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & Pure Science and Technology",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in Medicine, Engineering, Life Science, Technology",
    ],
    icon: <FaFlask className="text-3xl text-indigo-600" />,
  },
];

const hsProgrammes = [
  {
    id: 1,
    name: "School of Science and Technology",
    icon: <FaFlask className="text-3xl text-primary" />,
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & pure science",
      "Complete Foundation course in Islamic studies",
      "Complete HS in Science",
    ],
    image: "/photos/27.jpg",
  },
  {
    id: 2,
    name: "School of Islamic Theology and Arabic Literature",
    icon: <FiBookOpen className="text-3xl text-secondary" />,
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & Arabic Literature",
      "Complete Foundation course in Islamic studies",
      "Complete HS in Arts",
    ],
    image: "/photos/25.jpg",
  },
  {
    id: 3,
    name: "School of Competitive Exam",
    icon: <FaLandmark className="text-3xl text-primary" />,
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & UN Civil Service, UPSC, PSC, SSC Foundation",
      "Complete Foundation course in Islamic studies",
      "Complete HS in Arts",
    ],
    image: "/photos/61.jpg",
  },
  {
    id: 4,
    name: "School of Finance and Management",
    icon: <TbReportMoney className="text-3xl text-secondary" />,
    intake: 25,
    outcomes: [
      "Integrated studies between Islamic studies & CA, CMA , ACCA , CS , CAT Foundation Course",
      "Complete Foundation course in Islamic studies",
      "Complete HS in commerc",
    ],
    image: "/photos/62.jpg",
  },
];

const hssProgrammes = [
  {
    id: 1,
    course: "School of Life Science (Biology)",
    intake: 25,
    outcomes: [
      "Strong grounding in Biology–Math with Science Orbit support",
      "Integrated studies between Islam & biology",
      "Complete HSS + UG pathway with Bachelor in Islamic Science",
    ],
    icon: <FaFlask className="text-3xl text-blue-600" />,
  },
  {
    id: 2,
    course: "School of Computer Science",
    intake: 25,
    outcomes: [
      "Build strong computational and analytical foundations",
      "Complete JEE/KEAM foundation aligned with engineering pathways",
      "Complete HSS + UG in B.Tech/B.Sc with integrated Islamic studies",
    ],
    icon: <MdOutlineComputer className="text-3xl text-green-600" />,
  },
  {
    id: 3,
    course: "School of Arts and Humanities",
    intake: 25,
    outcomes: [
      "Foundation in humanities subjects with leadership and administrative skills",
      "Complete civil service foundation (UN, UPSC, PSC, SSC)",
      "Complete HSS + UG with optional Hifz Doura for Hifz students",
    ],
    icon: <FaBook className="text-3xl text-purple-600" />,
  },
  {
    id: 4,
    course:
      "School of Finance and Management (Senior School Level)",
    intake: 25,
    outcomes: [
      "Strong foundation in commerce with Islamic finance and Business Arabic",
      "Complete foundation for CA/CMA/ACCA/CS/CAT",
      "Complete HSS + UG progression with integrated Islamic studies",
    ],
    icon: <TbReportMoney className="text-3xl text-yellow-600" />,
  },
  // {
  //   id: 5,
  //   course: "Foundation in Islamic Studies & HSS Humanities (FIH)",
  //   intake: 25,
  //   outcomes: [
  //     "Integrated studies between Islam & humanity studies",
  //     "Integrated studies between Islam & social sciences",
  //     "Complete Foundation course in Islamic studies",
  //     "Complete HSS in Humanities",
  //   ],
  //   icon: <FaLandmark className="text-3xl text-red-600" />,
  // },
  // {
  //   id: 6,
  //   course:
  //     "Foundation in Islamic Studies with Hifz Doura & HSS Humanities (FIHH)",
  //   intake: 25,
  //   outcomes: [
  //     "Integrated studies between Islam & humanities",
  //     "Integrated studies between Islam & social sciences",
  //     "Complete Foundation course in Islamic studies",
  //     "Complete HSS in Humanities",
  //     "Complete Qur'an Hifz Doura",
  //   ],
  //   icon: <FaBook className="text-3xl text-indigo-600" />,
  // },
];

export { hsProgrammes, bsProgrammes, hssProgrammes };
