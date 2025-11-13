const defaultButtons = [
  { label: "print()", value: "print('Status OK')\n" },
  { label: 'variável =', value: 'evento_total = 0\n' },
  { label: 'f-string', value: 'f"Sensor: {nome}"' },
  { label: 'input()', value: "valor = int(input('Digite: '))\n" },
  { label: 'for range', value: 'for indice in range(5):\n    ' },
  { label: 'if / else', value: 'if condicao:\n    \nelse:\n    \n' },
  { label: 'lista []', value: 'leituras = []\n' },
  { label: 'dict {}', value: 'config = {\n    "limite": 30\n}\n' },
]

export default function SmartKeyboard({ onInsert, buttons = defaultButtons }) {
  return (
    <div className="smart-keyboard">
      {buttons.map((button) => (
        <button key={button.label} type="button" onClick={() => onInsert(button.value)}>
          {button.label}
        </button>
      ))}
    </div>
  )
}
