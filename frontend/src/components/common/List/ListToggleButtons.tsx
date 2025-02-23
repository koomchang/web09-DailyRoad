import { useStore } from '@/store/useStore';

type ToggleButtonProps = {
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
};

const ToggleButton = ({ options, selected, onSelect }: ToggleButtonProps) => {
  const addToast = useStore((state) => state.addToast);
  const isLogged = useStore((state) => state.isLogged);
  const onClick = (option: string) => {
    if (option === 'MY' && !isLogged) {
      addToast('로그인 후 이용해주세요', '', 'error');
      return;
    }
    onSelect(option);
  };

  return (
    <div className="relative mb-8 flex h-[45px] w-[700px] rounded-md bg-gray-200 shadow-inner">
      <div
        className={`absolute left-0 top-0 h-full w-1/2 rounded-md bg-c_bg_blue transition-transform duration-300 ${
          selected === options[1].value ? 'translate-x-full' : ''
        }`}
      ></div>

      {options.map((option) => (
        <button
          key={option.value}
          className={`test relative z-10 h-full w-1/2 text-center text-lg font-medium ${
            selected === option.value ? 'text-white' : 'text-gray-700'
          }`}
          onClick={() => onClick(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
