'use client'
import { getProblems } from '@/data/problems'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

const Problems = () => {
  const { data: problems } = useQuery({
    queryKey: ['problems'],
    queryFn: () => getProblems(),
  })

  console.log(problems)
  return (
    <div className="flex items-center justify-center">
      {problems?.map((problem) => (
        <Link href={`problems/${problem.id}`} key={problem.id}>
          {problem.name}
        </Link>
      ))}
    </div>
  )
}

export default Problems
