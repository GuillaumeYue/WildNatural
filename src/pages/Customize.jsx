import { useState } from 'react'
import axios from 'axios'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const INGREDIENTS = ['Rosemary', 'Lemon', 'Orange', 'Osmanthus Flowers', 'Malva', 'Other']

const TIME_SLOTS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
]

export default function Customize() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [otherIngredient, setOtherIngredient] = useState('')
  const [selectedDates, setSelectedDates] = useState(['', '', ''])
  const [selectedTimes, setSelectedTimes] = useState([
  [],
  [],
  []
])
  const [dateError, setDateError] = useState('')
  const [showPolicy, setShowPolicy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)
  const [showTimeSlots, setShowTimeSlots] = useState(false)
  const [hasAllergies, setHasAllergies] = useState('')
  const [allergyDescription, setAllergyDescription] = useState('')
  const [skinNeeds, setSkinNeeds] = useState('')

  const inputStyle =
    'w-full border border-ink/10 bg-white px-5 py-4 outline-none focus:border-rose-500 rounded-md'

  const getMinimumDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 9)
    return date.toISOString().split('T')[0]
  }

  const getMaximumDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 4)
    return date.toISOString().split('T')[0]
  }

  const fetchAddressFromPostalCode = async (postal) => {
    const cleanPostalCode = postal.replace(/\s+/g, '').toUpperCase()

    if (cleanPostalCode.length < 6) return

    try {
      const response = await fetch(
        `https://api.zippopotam.us/ca/${cleanPostalCode}`
      )

      if (!response.ok) return

      const data = await response.json()

      if (data.places && data.places.length > 0) {
        setCity(data.places[0]['place name'])
        setProvince(data.places[0].state)
      }
    } catch (error) {
      console.error('Postal lookup failed:', error)
    }
  }

  const handleDateChange = (index, value) => {
    const [year, month, date] = value.split('-').map(Number)
    const chosenDate = new Date(year, month - 1, date)
    const day = chosenDate.getDay()

    if (day !== 6 && day !== 0) {
      setDateError('Appointments are available only on Saturdays and Sundays.')

      const updatedDates = [...selectedDates]
      updatedDates[index] = ''
      setSelectedDates(updatedDates)
      return
    }

    const isDuplicate = selectedDates.some(
      (dateItem, dateIndex) => dateItem === value && dateIndex !== index
    )

    if (isDuplicate) {
      setDateError('Please choose three different dates.')
      return
    }

    const updatedDates = [...selectedDates]
    updatedDates[index] = value
    setSelectedDates(updatedDates)
    setDateError('')
  }

  const toggleTimeSlot = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time))
    } else {
      setSelectedTimes([...selectedTimes, time])
    }
  }
  const toggleDateTime = (dateIndex, time) => {
  const updated = [...selectedTimes]

  if (updated[dateIndex].includes(time)) {
    updated[dateIndex] = updated[dateIndex].filter(
      (t) => t !== time
    )
  } else {
    if (updated[dateIndex].length >= 3) {
      alert('Maximum 3 times per date')
      return
    }

    updated[dateIndex].push(time)
  }

  setSelectedTimes(updated)
}

  const handleSubmit = async (e) => {
    e.preventDefault()

    const filledDates = selectedDates.filter((date) => date !== '')

    if (filledDates.length < 3) {
      alert('Please select 3 preferred weekend dates.')
      return
    }

  const allDatesHaveThreeTimes = selectedTimes.every(
  (times) => times.length === 3
)

if (!allDatesHaveThreeTimes) {
  alert('Please select exactly 3 time slots for each date.')
  return
}

    const finalIngredients = selectedIngredients.includes('Other')
      ? [...selectedIngredients.filter((item) => item !== 'Other'), otherIngredient]
      : selectedIngredients

    setIsLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/customizations', {
        fullName,
        email,
        phoneNumber,
        address: {
          postalCode,
          province,
          city,
          addressLine1,
          addressLine2,
          country: 'Canada',
        },
        ingredients: finalIngredients,
        preferredDates: selectedDates,
        preferredTimes: selectedTimes,
        hasAllergies,
        allergyDescription,
      })

      alert('Thank you! Your consultation request has been submitted successfully.')

      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[1000px]">
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-rose-500 mb-8">
            Book Consultation
          </h1>

          <p className="max-w-3xl text-lg text-ink-soft leading-relaxed mb-16">
            Request a customized skincare consultation and choose three possible
            appointment dates and times for Sara to review.
          </p>

          <div className="bg-blush-50 p-10 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <p className="text-base tracking-[0.3em] uppercase text-rose-500 mb-4 font-bold">
                  Client Details
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  <input
    type="text"
    required
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    placeholder="Full Name"
    className={inputStyle}
  />

  <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email Address"
    className={inputStyle}
  />

  <input
    type="tel"
    required
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    placeholder="Phone Number"
    className={inputStyle}
  />

  <select
    required
    value={province}
    onChange={(e) => {
      setProvince(e.target.value)
      setCity('')
      setPostalCode('')
      setAddressLine1('')
      setAddressLine2('')
    }}
    className={inputStyle}
  >
    <option value="">Select Province</option>
    <option value="Alberta">Alberta</option>
    <option value="British Columbia">British Columbia</option>
    <option value="Manitoba">Manitoba</option>
    <option value="New Brunswick">New Brunswick</option>
    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
    <option value="Nova Scotia">Nova Scotia</option>
    <option value="Ontario">Ontario</option>
    <option value="Prince Edward Island">Prince Edward Island</option>
    <option value="Quebec">Quebec</option>
    <option value="Saskatchewan">Saskatchewan</option>
    <option value="Northwest Territories">Northwest Territories</option>
    <option value="Nunavut">Nunavut</option>
    <option value="Yukon">Yukon</option>
  </select>

  {province && (
    <>
      <input
        type="text"
        required
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        className={inputStyle}
      />

      <input
        type="text"
        required
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        placeholder="Postal Code (H1A 1A1)"
        pattern="^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$"
        className={inputStyle}
      />

      <input
        type="text"
        required
        value={addressLine1}
        onChange={(e) => setAddressLine1(e.target.value)}
        placeholder="Address Line 1 (Apt, Suite, Street)"
        className="w-full border border-ink/10 bg-white px-5 py-4 rounded-md md:col-span-2"
      />

      <input
        type="text"
        value={addressLine2}
        onChange={(e) => setAddressLine2(e.target.value)}
        placeholder="Address Line 2 (Optional)"
        className="w-full border border-ink/10 bg-white px-5 py-4 rounded-md md:col-span-2"
      />
    </>
  )}
</div>
              </div>

              <div>
                <label className="block text-base tracking-[0.15em] uppercase text-rose-500 font-bold mb-4">
                  Ingredient Preference (Optional)
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowIngredients(!showIngredients)}
                    className="w-full bg-white border border-gray-200 rounded-md px-5 py-4 text-left flex justify-between items-center hover:border-rose-500 transition"
                  >
                    <span>
                      {selectedIngredients.length > 0
                        ? selectedIngredients.join(', ')
                        : 'Select Ingredients'}
                    </span>

                    <span className="text-rose-500 text-lg">
                      {showIngredients ? '▲' : '▼'}
                    </span>
                  </button>

                  {showIngredients && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                      {INGREDIENTS.map((ingredient) => (
                        <label
                          key={ingredient}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIngredients.includes(ingredient)}
                            onChange={() => {
                              if (selectedIngredients.includes(ingredient)) {
                                setSelectedIngredients(
                                  selectedIngredients.filter((item) => item !== ingredient)
                                )
                              } else {
                                setSelectedIngredients([...selectedIngredients, ingredient])
                              }
                            }}
                            className="accent-rose-500 w-4 h-4"
                          />

                          <span>{ingredient}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {selectedIngredients.includes('Other') && (
                  <div className="mt-4">
                    <input
                      type="text"
                      maxLength={100}
                      value={otherIngredient}
                      onChange={(e) => setOtherIngredient(e.target.value)}
                      placeholder="Please mention other ingredient"
                      className={inputStyle}
                    />

                    <p className="mt-2 text-sm text-gray-500">
                      {otherIngredient.length}/100 characters
                    </p>
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  Select one or multiple ingredients.
                </p>
              </div>

              <div>
  <p className="text-base tracking-[0.3em] uppercase text-rose-500 mb-4 font-bold">
    Choose 3 Preferred Weekend Dates and Times
  </p>

  <div className="space-y-3">
    {[0, 1, 2].map((index) => (
      <div key={index} className="border border-rose-100 rounded-xl p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 items-center">
          <input
            type="date"
            required
            min={getMinimumDate()}
            max={getMaximumDate()}
            value={selectedDates[index]}
            onChange={(e) => handleDateChange(index, e.target.value)}
            className="w-full border border-ink/10 bg-white px-4 py-3 outline-none focus:border-rose-500 rounded-md"
          />

          <div className="flex flex-wrap gap-2">
            {selectedTimes[index].length > 0 ? (
              selectedTimes[index].map((time) => (
                <span
                  key={time}
                  className="bg-rose-500 text-white px-3 py-2 rounded-full text-sm"
                >
                  {time}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">
                No time selected yet
              </span>
            )}
          </div>
        </div>

        <details className="mt-2">
          <summary className="cursor-pointer font-medium text-rose-500 text-sm">
            Select up to 3 times for this date
          </summary>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3">
            {TIME_SLOTS.map((time) => (
              <label
                key={time}
                className={`cursor-pointer border rounded-md px-2 py-2 text-center text-sm ${
                  selectedTimes[index].includes(time)
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedTimes[index].includes(time)}
                  onChange={() => toggleDateTime(index, time)}
                />
                {time}
              </label>
            ))}
          </div>
        </details>
      </div>
    ))}
  </div>

  {dateError && (
    <p className="mt-3 text-sm text-rose-500">{dateError}</p>
  )}

  <p className="mt-3 text-sm text-ink-soft">
    Select 3 different weekend dates and up to 3 times for each date.
  </p>
</div>

<div>
  <label className="block text-base tracking-[0.15em] uppercase text-rose-500 font-bold mb-4">
    Tell Us About Your Skin Needs
  </label>

  <div className="bg-white border border-rose-100 rounded-xl p-5">
    <textarea
      required
      maxLength={120}
      rows={4}
      value={skinNeeds}
      onChange={(e) => setSkinNeeds(e.target.value)}
      placeholder="Tell us about your skin concerns, goals or anything else you would like Sara to know."
      className="w-full border border-ink/10 bg-white px-5 py-4 rounded-md resize-none outline-none focus:border-rose-500"
    />

    <p className="mt-2 text-sm text-gray-500">
      {skinNeeds.length}/120 characters
    </p>
  </div>
</div>

              <div>
                <label className="block text-base tracking-[0.15em] uppercase text-rose-500 font-bold mb-4">
                  Allergy Information
                </label>

                <div className="bg-white border border-rose-100 rounded-xl p-5">
                  <p className="font-medium mb-4">
                    Do you have any allergies?
                  </p>

                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="allergies"
                        value="yes"
                        checked={hasAllergies === 'yes'}
                        onChange={(e) => setHasAllergies(e.target.value)}
                        className="accent-rose-500"
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="allergies"
                        value="no"
                        checked={hasAllergies === 'no'}
                        onChange={(e) => setHasAllergies(e.target.value)}
                        className="accent-rose-500"
                      />
                      No
                    </label>
                  </div>

                  {hasAllergies === 'yes' && (
                    <>
                      <textarea
                        required
                        maxLength={100}
                        rows={4}
                        value={allergyDescription}
                        onChange={(e) => setAllergyDescription(e.target.value)}
                        placeholder="Please describe your allergies"
                        className="w-full border border-ink/10 bg-white px-5 py-4 rounded-md resize-none outline-none focus:border-rose-500"
                      />

                      <p className="mt-2 text-sm text-gray-500">
                        {allergyDescription.length}/100 characters
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="border border-rose-200 bg-white p-6 rounded-md">
                <h3 className="font-display text-3xl text-ink mb-4 flex items-center gap-3">
                  Appointment & Payment Policy

                  <button
                    type="button"
                    onClick={() => setShowPolicy(!showPolicy)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-rose-500 text-sm text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    i
                  </button>
                </h3>

                {showPolicy && (
                  <ul className="space-y-3 text-ink-soft leading-relaxed text-base">
                    <li>• During your appointment, Sara will discuss your skincare concerns and needs.</li>
                    <li>• Research and formulation may take 3–7 months depending on the product complexity.</li>
                  </ul>
                )}
              </div>

              <div className="border border-rose-200 bg-white p-6 rounded-md">
                <h3 className="font-display text-3xl text-ink mb-5">
                  Declaration
                </h3>

                <ul className="space-y-3 text-base text-ink-soft leading-relaxed mb-6">
                  <li>• This consultation is for skincare guidance and product recommendations only.</li>
                  <li>• This is not a medical appointment.</li>
                  <li>• This appointment may be recorded for quality assurance and training purposes.</li>
                </ul>

                <label className="flex items-start gap-3 text-base text-ink">
                  <input type="checkbox" required className="mt-1 h-4 w-4 accent-rose-500" />
                  <span>
                    I understand and confirm that the information I provided is accurate and truthful.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 transition-colors text-white py-5 rounded-md tracking-[0.2em] text-sm font-bold"
              >
                {isLoading ? 'PROCESSING...' : 'SUBMIT CONSULTATION REQUEST'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}