import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PersonaCardProps {
  id: string;
  label: string;
  icon: string;
  description: string;
  index: number;
}

const PersonaCard = ({ id, label, icon, description, index }: PersonaCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      onClick={() => navigate(`/eligibility?persona=${id}`)}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      <span className="text-4xl">{icon}</span>
      <span className="font-heading text-base font-semibold text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </motion.button>
  );
};

export default PersonaCard;
