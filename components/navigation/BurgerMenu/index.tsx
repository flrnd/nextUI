import Button from "components/controls/Button";
import NavigationItemList from "components/navigation/NavigationItemList";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface IProps {
  menu: string[];
}

const BurgerMenu = ({ menu }: IProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (): void => setIsOpen(!isOpen);

  const modalContentVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  };

  const modalVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <div className="menu">
      <div className="burger-menu ml-auto">
        <Button ariaLabel="menu-button" onClick={handleClick}>
          <svg
            className="fill-current h-6 w-6"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Button>
      </div>

      <motion.div
        role="dialog"
        aria-label="modal"
        aria-hidden={isOpen ? "false" : "true"}
        className={isOpen ? "modal" : "hidden"}
        onClick={handleClick}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.2 }}
        variants={modalVariants}
      >
        <motion.div
          aria-label="modal-content"
          className="modal-content"
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.2 }}
          variants={modalContentVariants}
        >
          <div className="medium font-bold mb-5">
            <Link href="/">Inicio</Link>
          </div>
          <NavigationItemList list={menu} isVertical={isOpen} />
          <Link
            href="/signin"
            className="p-4 font-bold text-indigo-500 hover:text-indigo-800"
          >
            login
          </Link>
        </motion.div>
      </motion.div>
      <div aria-label="navigation-menu" className="nav-menu">
        <NavigationItemList list={menu} />
        <Link
          href="/signin"
          className="p-4 font-bold text-indigo-500 hover:text-indigo-800"
        >
          login
        </Link>
      </div>
    </div>
  );
};

export default BurgerMenu;
