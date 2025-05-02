"use client";

import React, { useState, useEffect } from 'react';

interface SummaryDrink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

interface DetailedDrink extends SummaryDrink {
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  [key: string]: any;
}

const App: React.FC = () => {
  const [drinks, setDrinks] = useState<SummaryDrink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<DetailedDrink | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail'
        );
        const data = (await res.json()) as { drinks: SummaryDrink[] };
        setDrinks(data.drinks ?? []);
      } catch (err) {
        console.error('Error fetching cocktails:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  const handleSelect = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = (await res.json()) as { drinks: DetailedDrink[] };
      if (data.drinks?.length) setSelectedDrink(data.drinks[0]);
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setSelectedDrink(null);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-center">
      {!selectedDrink ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
          {drinks.map(drink => (
            <div
              key={drink.idDrink}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleSelect(drink.idDrink)}
            >
              <img
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                className="w-24 h-auto rounded-lg"
              />
              <h3 className="mt-2 text-sm font-medium">{drink.strDrink}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto text-left">
          <button
            onClick={handleBack}
            className="block mx-auto mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold mb-2">{selectedDrink.strDrink}</h2>
          <img
            src={selectedDrink.strDrinkThumb}
            alt={selectedDrink.strDrink}
            className="w-48 h-auto mx-auto mb-4 rounded-lg"
          />
          <p><strong>Category:</strong> {selectedDrink.strCategory}</p>
          <p><strong>Alcoholic:</strong> {selectedDrink.strAlcoholic}</p>
          <p><strong>Glass:</strong> {selectedDrink.strGlass}</p>
          <h3 className="mt-4 text-xl font-semibold">Instructions</h3>
          <p>{selectedDrink.strInstructions}</p>
          <h3 className="mt-4 text-xl font-semibold">Ingredients</h3>
          <ul className="list-disc list-inside mt-2">
            {Array.from({ length: 15 }).map((_, i) => {
              const ing = selectedDrink[`strIngredient${i + 1}`];
              const measure = selectedDrink[`strMeasure${i + 1}`];
              return (
                ing ? (
                  <li key={i} className="text-sm">
                    {measure?.trim()} {ing}
                  </li>
                ) : null
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
