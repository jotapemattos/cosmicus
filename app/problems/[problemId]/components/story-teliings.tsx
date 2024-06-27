'use client'

import StoryTellingDialog from '@/components/story-telling-dialog'
import { getStoryTellingsByProblemId } from '@/data/story-teliings'
import { useQuery } from '@tanstack/react-query'

import { parseAsInteger, useQueryState } from 'nuqs'

interface StoryTellingProps {
  problemId: number
}

const StoryTeliings = ({ problemId }: StoryTellingProps) => {
  const [currentStory] = useQueryState(
    'currentStory',
    parseAsInteger.withDefault(0),
  )

  const { data: storyTellings } = useQuery({
    queryKey: ['story-tellings', problemId],
    queryFn: () => getStoryTellingsByProblemId({ problemId }),
  })

  return (
    <>
      {storyTellings?.map(
        (item, index) =>
          index === currentStory && (
            <StoryTellingDialog
              storyTelling={item}
              character={item.characters!}
              key={item.id}
            />
          ),
      )}
    </>
  )
}

export default StoryTeliings
