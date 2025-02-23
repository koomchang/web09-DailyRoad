import React, { useEffect, useMemo } from 'react';

import Marker from '@/components/Marker/Marker';
import PlaceItem from './PlaceItem';

import { getPlace } from '@/api/place';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useStore } from '@/store/useStore';
import { CustomPlace, Place } from '@/types';

type SearchResultsProps = {
  query: string;
  places: (Place & CustomPlace)[];
};

const SearchResults = ({ query, places }: SearchResultsProps) => {
  const { ref, data, isFetchingNextPage, hasNextPage } = useInfiniteScroll<
    Place[]
  >({
    queryKey: ['places', 'search'],
    query: query,
    queryFn: ({ pageParam }) => getPlace(query, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 5) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  const moveTo = useStore((state) => state.moveTo);
  const isEmptyResults = (data?: { pages: Place[][] }) =>
    !data?.pages || data.pages.every((page) => page.length === 0);

  const isEmpty = isEmptyResults(data);

  const existingPlaceIds = useMemo(
    () => new Set(places.map((place) => place.id)),
    [places],
  );

  useEffect(() => {
    if (!isEmpty && data) {
      moveTo(
        data.pages[data.pages.length - 1][0].location.latitude,
        data.pages[data.pages.length - 1][0].location.longitude,
      );
    }
  }, [data, isEmpty]);

  return (
    <div className="max-h-[600px]">
      {query && <p className="p-1 text-base">"{query}"에 대한 검색결과</p>}
      {!isEmpty ? (
        <div className="scrollbar-thumb-rounded-lg flex h-[550px] flex-col overflow-y-auto p-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.map((place: Place) => (
                <React.Fragment key={place.id}>
                  <PlaceItem key={place.id} place={place} />
                  {!existingPlaceIds.has(place.id) && (
                    <Marker
                      title={place.name}
                      key={place.google_place_id}
                      position={{
                        lat: place.location.latitude,
                        lng: place.location.longitude,
                      }}
                      category={place.category}
                      address={place.formed_address}
                    />
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          <div ref={ref} className="h-1" />
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center">
          <p className="text-lg text-c_button_gray">검색 결과 없음</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
