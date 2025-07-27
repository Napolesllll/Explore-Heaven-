// app/tours/page.jsx
'use client'

import { useEffect, useState } from 'react'
import TourCard from '@/components/TourCard'

export default function ToursPage() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours')
        const data = await response.json()
        setTours(data)
      } catch (error) {
        console.error('Error fetching tours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  if (loading) return <div>Cargando tours...</div>

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Nuestros Destinos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}