'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Textarea } from "@/components/ui/textarea"

const questions = [
  '¿Las herramientas están organizadas y en su lugar asignado?',
  '¿Hay señalización visual clara para ubicar herramientas, repuestos y equipos?',
  '¿El personal ha eliminado basura y objetos innecesarios del área de trabajo?',
  '¿Los pisos, estanterías y superficies están limpios y libres de polvo?',
  '¿Las áreas de trabajo están libres de derrames de lubricantes o sustancias químicas?',
  '¿Se aplican rutinas de limpieza diarias o semanales con responsables asignados?',
  '¿Los materiales, lubricantes y repuestos están etiquetados correctamente y almacenados en su sitio y según su categoría?',
  '¿Los pasillos y zonas de circulación están libres de obstáculos y claramente delimitados?',
  '¿Los equipos de seguridad (botiquín, extintores, EPP) están disponibles, visibles y en buen estado?',
  '¿La maquinaria y equipos eléctricos funcionan correctamente y sin señales de deterioro?'
];

export default function Home() {
  const [answers, setAnswers] = useState<boolean[]>(new Array(10).fill(false));
  const [observations, setObservations] = useState('');
  const { theme, setTheme } = useTheme();

  const calculateScore = () => {
    const trueCount = answers.filter(answer => answer).length;
    return `${trueCount}/10`;
  };

 const handleShare = () => {
  const score = calculateScore();
  const date = new Date().toLocaleDateString();

  // Resultados visuales con emojis
  const results = answers
    .map((answer, i) => `${i + 1}. ${answer ? '✅' : '❌'}`)
    .join('\n');

  // Resumen de preguntas al final
  const questionsSummary = questions
    .map((q, i) => `${i + 1}. ${q}`)
    .join('\n');

  const message = 
    `Checklist de Inspección Diaria – Taller/Bodega de Mantenimiento\n\n` +
    `Fecha: ${date}\nCalificación: ${score}\n\n` +
    `Resultados:\n${results}\n\n` +
    `Observaciones:\n${observations || 'Ninguna'}\n\n` +
    `Preguntas:\n${questionsSummary}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-2xl mx-auto p-6 shadow-lg bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Checklist de Inspección Diaria
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <Label 
                  htmlFor={`question-${index}`} 
                  className="flex-1 cursor-pointer"
                >
                  {index + 1}. {question}
                </Label>
                <Switch
                  id={`question-${index}`}
                  checked={answers[index]}
                  onCheckedChange={(checked) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = checked;
                    setAnswers(newAnswers);
                  }}
                  aria-label={`Respuesta para: ${question}`}
                />
              </div>
            </div>
          ))}

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-all duration-200 hover:shadow-md">
            <Label htmlFor="observations" className="text-lg font-semibold mb-2 block">
              Observaciones:
            </Label>
            <Textarea
              id="observations"
              placeholder="Ingrese sus observaciones aquí..."
              className="min-h-[100px] w-full mt-2"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-center text-2xl font-bold" role="status" aria-live="polite">
            Calificación: {calculateScore()}
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleShare}
            aria-label="Compartir resultados por WhatsApp"
          >
            Compartir por WhatsApp
          </Button>
        </div>
      </Card>
    </div>
  );
}