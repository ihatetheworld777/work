import type { DataTableColumn } from 'naive-ui';

import { reactive, ref } from 'vue';

import { defineStore } from 'pinia';

export const getRandomDate = (start: Date, end: Date): string => {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '2024-01-01';
  }

  if (start.getTime() > end.getTime()) {
    [start, end] = [end, start];
  }

  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
};

export const getRandomAmount = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

export const getRandomString = (prefix: string, length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getRandomAddress = () => {
  const streets = ['东街', '西街', '南路', '北路', '环城路', '科技大道'];
  const buildingNumbers = ['1号', '2号', '3号', '4号', '5号'];
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '武汉'];

  return `${cities[Math.floor(Math.random() * cities.length)]} ${streets[Math.floor(Math.random() * streets.length)]} ${buildingNumbers[Math.floor(Math.random() * buildingNumbers.length)]}`;
};

export const safeAccess = <T>(array: T[], index: number, defaultValue: T) => {
  return array[index] === undefined ? defaultValue : array[index];
};

export const useAnalyticsStore = defineStore('analyticsStore', () => {
  const projectItems = ref<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const selectedProject = ref<string>();
  const checkRange = ref<string>('all');
  const checkDateRange = ref<[number, number]>();

  const updateProjectItems = (data: any) => {
    const _projects = new Set<string>();

    data.forEach((item: any) => {
      _projects.add(item.projectName);
    });

    projectItems.value = [..._projects].map((project) => ({
      label: project,
      value: project,
    }));
  };

  return {
    projectItems,
    updateProjectItems,
    selectedProject,
    checkRange,
    checkDateRange,
  };
});

export const projectColumn = reactive<DataTableColumn<{ projectName: string }>>(
  {
    title: '项目名称',
    key: 'projectName',
    width: 120,
    fixed: 'left',
    filter(value, row) {
      return row.projectName === value;
    },
  },
);

const store = useAnalyticsStore();

export const contractStartDateColumn = reactive<
  DataTableColumn<{
    contractStartDate: string;
  }>
>({
  title: '合同起始日',
  key: 'contractStartDate',
  width: 150,
  fixed: 'left',
  filter(value, row) {
    switch (value) {
      case 'month': {
        const currentDate = new Date();
        const firstDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        const lastDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
        );
        return (
          new Date(row.contractStartDate) >= firstDay &&
          new Date(row.contractStartDate) <= lastDay
        );
      }

      case 'week': {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const first =
          currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        const last = first + 6;
        const firstDay = new Date(currentDate.setDate(first));
        const lastDay = new Date(currentDate.setDate(last));
        return (
          new Date(row.contractStartDate) >= firstDay &&
          new Date(row.contractStartDate) <= lastDay
        );
      }

      case 'year': {
        if (store.checkDateRange) {
          const [start, end] = store.checkDateRange;
          return (
            new Date(row.contractStartDate) >= new Date(start) &&
            new Date(row.contractStartDate) <= new Date(end)
          );
        }
        return true;
      }

      default: {
        return true;
      }
    }
  },
});
