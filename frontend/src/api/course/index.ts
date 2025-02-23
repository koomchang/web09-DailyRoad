import { axiosInstance } from '@/api/axiosInstance';

import { BaseMap, Course, CourseList } from '@/types';
import { END_POINTS } from '@/constants/api';

type CourseResponse = {
  id: number;
};

type EditInfoResponse = {
  id: number;
  title: string;
  description: string;
};

type EditVisiviltyResponse = {
  id: number;
  isPublic: boolean;
};

export const createCourse = async (baseCourseData: Omit<BaseMap, 'mode'>) => {
  const { data } = await axiosInstance.post<CourseResponse>(
    END_POINTS.COURSES,
    baseCourseData,
  );
  return data.id;
};

export const getCourse = async (courseId: number) => {
  const { data } = await axiosInstance.get<Course>(
    END_POINTS.COURSE(courseId),
    { useAuth: false },
  );
  return data;
};

export const getCourseList = async (pageParam: number, query?: string) => {
  const { data } = await axiosInstance.get<CourseList>(END_POINTS.COURSES, {
    params: {
      page: pageParam,
      query,
    },
    useAuth: false,
  });
  return data;
};

export const getMyCourseList = async (pageParam: number) => {
  const { data } = await axiosInstance.get<CourseList>(END_POINTS.MY_COURSE, {
    params: {
      page: pageParam,
    },
  });
  return data;
};

export const editCourseInfo = async ({
  title,
  description,
  thumbnailUrl,
  courseId,
}: {
  title: string;
  description: string;
  thumbnailUrl: string;
  courseId: number;
}) => {
  const { data } = await axiosInstance.patch<EditInfoResponse>(
    END_POINTS.EDIT_COURSE_INFO(courseId),
    {
      title,
      description,
      thumbnailUrl,
    },
  );
  return data;
};

export const editCourseVisibility = async ({
  courseId,
  isPublic,
}: {
  courseId: number;
  isPublic: boolean;
}) => {
  const { data } = await axiosInstance.patch<EditVisiviltyResponse>(
    END_POINTS.EDIT_COURSE_VISIBILITY(courseId),
    {
      isPublic,
    },
  );
  return data;
};

export const editCourse = async (data: BaseMap & { courseId: number }) => {
  const [infoResponse, visibilityResponse] = await Promise.all([
    editCourseInfo({
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl ?? '',
      courseId: data.courseId,
    }),
    editCourseVisibility({ courseId: data.courseId, isPublic: data.isPublic }),
  ]);
  return { ...infoResponse, ...visibilityResponse };
};

export const deleteCourse = async (CourseId: number) => {
  const { data } = await axiosInstance.delete(END_POINTS.COURSE(CourseId));
  return data;
};
