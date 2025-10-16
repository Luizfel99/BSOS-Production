'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface InputFieldProps {
  label: string;
  type?: 'text' | 'number' | 'date' | 'time' | 'textarea' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

// Modal Base Component
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Input Field Component
export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  const baseClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          value={value as string}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${baseClasses} resize-none h-20`}
          required={required}
        />
      ) : type === 'select' && options ? (
        <select
          value={value as string}
          onChange={handleChange}
          className={baseClasses}
          required={required}
        >
          <option value="">{placeholder || 'Selecione...'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={baseClasses}
          required={required}
        />
      )}
    </div>
  );
};

// Specific Modal Components

// Modal para edição de valores
interface EditValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue: number;
  onSave: (value: number, reason: string) => void;
}

export const EditValuesModal: React.FC<EditValuesModalProps> = ({
  isOpen,
  onClose,
  currentValue,
  onSave,
}) => {
  const [newValue, setNewValue] = useState(currentValue);
  const [reason, setReason] = useState('');

  const handleSave = () => {
    if (!reason.trim()) {
      toast.error('Motivo da alteração é obrigatório');
      return;
    }
    onSave(newValue, reason);
    onClose();
    setReason('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Valores">
      <InputField
        label="Novo Valor"
        type="number"
        value={newValue}
        onChange={(value) => setNewValue(value as number)}
        placeholder="0.00"
        required
      />
      
      <InputField
        label="Motivo da Alteração"
        type="textarea"
        value={reason}
        onChange={(value) => setReason(value as string)}
        placeholder="Descreva o motivo da alteração..."
        required
      />

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Salvar Alteração
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

// Modal para configuração de bônus
interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  onSave: (bonus: number, reason: string, month: number, year: number) => void;
}

export const BonusModal: React.FC<BonusModalProps> = ({
  isOpen,
  onClose,
  employeeName,
  onSave,
}) => {
  const [bonus, setBonus] = useState(0);
  const [reason, setReason] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSave = () => {
    if (!reason.trim()) {
      toast.error('Motivo do bônus é obrigatório');
      return;
    }
    if (bonus <= 0) {
      toast.error('Valor do bônus deve ser positivo');
      return;
    }
    onSave(bonus, reason, month, year);
    onClose();
    setBonus(0);
    setReason('');
  };

  const monthOptions = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configurar Bônus - ${employeeName}`}>
      <InputField
        label="Valor do Bônus (R$)"
        type="number"
        value={bonus}
        onChange={(value) => setBonus(value as number)}
        placeholder="0.00"
        required
      />
      
      <InputField
        label="Motivo do Bônus"
        type="textarea"
        value={reason}
        onChange={(value) => setReason(value as string)}
        placeholder="Ex: Excelente performance, cliente muito satisfeito..."
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Mês"
          type="select"
          value={month.toString()}
          onChange={(value) => setMonth(parseInt(value as string))}
          options={monthOptions}
          required
        />
        
        <InputField
          label="Ano"
          type="number"
          value={year}
          onChange={(value) => setYear(value as number)}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          💰 Aprovar Bônus
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

// Modal para agendamento detalhado
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  onSave: (scheduleData: any) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  propertyName,
  onSave,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState(120);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!date || !time || !type) {
      toast.error('Data, horário e tipo de limpeza são obrigatórios');
      return;
    }

    const scheduleData = {
      date,
      time,
      type,
      estimatedDuration: duration,
      specialRequests: notes,
    };

    onSave(scheduleData);
    onClose();
    // Reset form
    setDate('');
    setTime('');
    setType('');
    setDuration(120);
    setNotes('');
  };

  const serviceTypes = [
    { value: 'basic', label: 'Limpeza Básica (R$ 80)' },
    { value: 'standard', label: 'Limpeza Padrão (R$ 100)' },
    { value: 'premium', label: 'Limpeza Premium (R$ 150)' },
    { value: 'deep', label: 'Limpeza Pesada (R$ 200)' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Agendar Limpeza - ${propertyName}`}>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Data"
          type="date"
          value={date}
          onChange={(value) => setDate(value as string)}
          required
        />
        
        <InputField
          label="Horário"
          type="time"
          value={time}
          onChange={(value) => setTime(value as string)}
          required
        />
      </div>

      <InputField
        label="Tipo de Limpeza"
        type="select"
        value={type}
        onChange={(value) => setType(value as string)}
        options={serviceTypes}
        placeholder="Selecione o tipo de serviço"
        required
      />

      <InputField
        label="Duração Estimada (minutos)"
        type="number"
        value={duration}
        onChange={(value) => setDuration(value as number)}
        placeholder="120"
      />
      
      <InputField
        label="Observações Especiais"
        type="textarea"
        value={notes}
        onChange={(value) => setNotes(value as string)}
        placeholder="Ex: Cuidado com plantas, animal de estimação..."
      />

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          📅 Agendar Limpeza
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};