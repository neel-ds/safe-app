interface IButton {
  id: string;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ id, title, onClick, disabled }: IButton) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className="bg-[#A36EFD] hover:bg-[#9a61fc] disabled:opacity-75 hover:shadow-lg text-white py-2.5 px-6 rounded-xl w-fit font-medium text-sm md:text-lg disabled:cursor-progress"
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;
