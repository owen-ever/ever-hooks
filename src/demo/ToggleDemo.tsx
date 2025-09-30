import { useToggle } from '@hooks/useToggle';

export default function ToggleDemo() {
  const { value, toggle, setTrue, setFalse } = useToggle();

  return (
    <div>
      <p>현재 값: {value ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
    </div>
  );
}
