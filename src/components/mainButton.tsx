
type Props = {
  title?: string;
  onClick?: () => void; // More specific typing for onClick
};

export default function MainButton({ onClick, title }: Props) {
  return (
    <button

      className="flex justify-center text-xl border-2 border-blue-500  bg-blue-600 w-[100px]  rounded-sm text-white font-semibold py-1 px-2  hover:bg-blue-500 transition duration-200 ease-in-out"

      onClick={onClick}
    >
      {title}
    </button>
  );
}
