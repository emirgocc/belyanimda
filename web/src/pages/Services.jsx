import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
// Modifiers removed to avoid dependency issues
// import {
//   restrictToVerticalAxis,
//   restrictToWindowEdges,
// } from '@dnd-kit/modifiers';
import { servicesAPI } from '../services/api';
import ServiceModal from '../components/ServiceModal';
import SortableServiceItem from '../components/SortableServiceItem';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      if (response.success) {
        const sortedServices = response.data.sort((a, b) => a.order - b.order);
        setServices(sortedServices);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error('Hizmetler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`"${service.name}" hizmetini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await servicesAPI.delete(service.id);
      if (response.success) {
        toast.success('Hizmet başarıyla silindi');
        loadServices();
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Hizmet silinirken hata oluştu');
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const response = await servicesAPI.update(service.id, {
        ...service,
        active: !service.active,
      });
      if (response.success) {
        toast.success(`Hizmet ${service.active ? 'devre dışı bırakıldı' : 'etkinleştirildi'}`);
        loadServices();
      }
    } catch (error) {
      console.error('Failed to toggle service:', error);
      toast.error('Hizmet durumu değiştirilirken hata oluştu');
    }
  };

  const handleServiceSaved = () => {
    setModalOpen(false);
    setEditingService(null);
    loadServices();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // Update order on server
      try {
        setReordering(true);
        const oldIndex = services.findIndex((item) => item.id === active.id);
        const newIndex = services.findIndex((item) => item.id === over.id);
        const reorderedServices = arrayMove(services, oldIndex, newIndex);
        
        const orderedIds = reorderedServices.map(service => service.id);
        const response = await servicesAPI.reorder(orderedIds);
        
        if (response.success) {
          toast.success('Hizmet sıralaması güncellendi');
          loadServices(); // Reload to get updated order values
        }
      } catch (error) {
        console.error('Failed to reorder services:', error);
        toast.error('Sıralama güncellenirken hata oluştu');
        loadServices(); // Reload original order
      } finally {
        setReordering(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hizmetler</h1>
          <p className="text-gray-600 mt-1">
            Mobil uygulamada görünecek hizmetleri yönetin
          </p>
        </div>
        <button
          onClick={handleCreateService}
          className="btn-primary"
        >
          ➕ Yeni Hizmet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">🛠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Toplam</p>
              <p className="text-lg font-semibold">{services.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Aktif</p>
              <p className="text-lg font-semibold">
                {services.filter(s => s.active).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pasif</p>
              <p className="text-lg font-semibold">
                {services.filter(s => !s.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hizmet Listesi</h2>
          <p className="text-sm text-gray-600 mt-1">
            Sürükle-bırak ile sıralamayı değiştirebilirsiniz
          </p>
        </div>

        {services.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={services} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {services.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                    onToggleActive={handleToggleActive}
                    disabled={reordering}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-3xl">🛠️</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Henüz hizmet eklenmemiş
            </h3>
            <p className="mt-2 text-gray-600">
              İlk hizmetinizi eklemek için yukarıdaki butona tıklayın.
            </p>
            <button
              onClick={handleCreateService}
              className="mt-4 btn-primary"
            >
              Hizmet Ekle
            </button>
          </div>
        )}
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={editingService}
        onSaved={handleServiceSaved}
      />
    </div>
  );
};

export default Services;
