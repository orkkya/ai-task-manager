import React, { useState, useEffect } from 'react';
import './App.css';

// Veri Tipi Tanımı (TypeScript Interface - Yönergede istenen Interfaces yapısı)
interface Task {
  id: number;
  title: string;
  category: string;
}

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => void;
}

// Alt Bileşen: Tekil Görev Kartı
function TaskItem({ task, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(task.title);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate(task.id, editedTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            width: '100%',
            marginRight: '0.5rem',
          }}
        >
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
          />
          <button className="btn-primary" onClick={handleSave}>
            Kaydet
          </button>
        </div>
      ) : (
        <>
          <div className="task-info">
            <span className="task-title">{task.title}</span>
            <span className="task-category">{task.category}</span>
          </div>
          <div>
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Düzenle
            </button>
            <button className="btn-danger" onClick={() => onDelete(task.id)}>
              Sil
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Ana Uygulama Bileşeni
export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ai_tasks');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: 'Python veri temizleme scriptini hazırla',
            category: 'Veri Analizi',
          },
          {
            id: 2,
            title: 'LinearRegression modelini test et',
            category: 'Model Eğitimi',
          },
        ];
  });

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Veri Analizi');

  // LocalStorage Kaydı
  useEffect(() => {
    localStorage.setItem('ai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 1. EKLEME İŞLEMİ (Create)
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      category,
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
  };

  // 2. SİLME İŞLEMİ (Delete)
  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // 3. GÜNCELLEME İŞLEMİ (Update)
  const handleUpdate = (id: number, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h1>AI Proje & Görev Takipçisi</h1>
        <p className="subtitle">
          Yapay Zeka ve Web Geliştirme Staj Takip Paneli
        </p>

        <form onSubmit={handleAdd}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Yeni bir görev veya prompt girin..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Veri Analizi">Veri Analizi</option>
              <option value="Model Eğitimi">Model Eğitimi</option>
              <option value="Web Arayüzü">Web Arayüzü</option>
              <option value="Dokümantasyon">Dokümantasyon</option>
            </select>
            <button type="submit" className="btn-primary">
              Ekle
            </button>
          </div>
        </form>
      </div>

      {/* 4. LİSTELEME İŞLEMİ (Read) */}
      <div className="card">
        <h2
          style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: '#cbd5e1',
            textAlign: 'left',
          }}
        >
          Görev Listesi ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <p className="empty-state">Henüz eklenmiş bir görev yok.</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
