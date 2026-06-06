import { closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { providers } from './constants';

export type ProviderKey = keyof typeof providers;

const DEFAULT_ORDER = Object.keys(providers) as ProviderKey[];

const orderAtom = atomWithStorage<ProviderKey[]>('torrent-providers-order', DEFAULT_ORDER, undefined, {
  unstable_getOnInit: true
});

const sanitize = (order: ProviderKey[]) => {
  const known = order.filter((key) => key in providers);
  const missing = DEFAULT_ORDER.filter((key) => !known.includes(key));

  return [...known, ...missing];
};

const useProvidersOrder = () => {
  const [order, setOrder] = useAtom(orderAtom);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    void setOrder((current) => {
      const activeIndex = current.indexOf(active.id as ProviderKey);
      const overIndex = current.indexOf(over.id as ProviderKey);

      if (activeIndex === -1 || overIndex === -1) return current;

      return arrayMove(current, activeIndex, overIndex);
    });
  };

  return { order: sanitize(order), sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd };
};

export default useProvidersOrder;
