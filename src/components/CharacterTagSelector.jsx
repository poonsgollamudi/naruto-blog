import React from 'react'

// Common Naruto characters grouped by teams/affiliations
const characterGroups = {
  'Team 7': ['Naruto Uzumaki', 'Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake', 'Sai'],
  'Akatsuki': ['Itachi Uchiha', 'Kisame Hoshigaki', 'Pain', 'Konan', 'Deidara', 'Sasori', 'Hidan', 'Kakuzu', 'Tobi', 'Uchiha Madara', 'Orochimaru', 'Zetsu'],
  'Sand Siblings': ['Gaara', 'Temari', 'Kankuro'],
  'Team 8': ['Hinata Hyuga', 'Kiba Inuzuka', 'Shino Aburame', 'Kurenai Yuhi'],
  'Team 10': ['Shikamaru Nara', 'Ino Yamanaka', 'Choji Akimichi', 'Asuma Sarutobi'],
  'Team Guy': ['Rock Lee', 'Neji Hyuga', 'Tenten', 'Might Guy'],
  'Hokage': ['Hashirama Senju', 'Tobirama Senju', 'Hiruzen Sarutobi', 'Minato Namikaze', 'Tsunade', 'Hatake Kakashi', 'Uzumaki Naruto'],
  'Other':['Kabuto Yakushi', 'Jiraiya', 'Shisui Uchiha', 'Killer Bee', 'A', 'Danzo', 'Kushina Uzumaki', 'Mito Uzumaki', 'Konohamaru Sarutobi']
}

export default function CharacterTagSelector({ currentTags, onSelect }) {
  const addTag = (character) => {
    const tagList = currentTags.split(',').map(t => t.trim()).filter(Boolean)
    if (!tagList.includes(character.toLowerCase())) {
      const newTags = [...tagList, character.toLowerCase()].join(', ')
      onSelect(newTags)
    }
  }

  return (
    <div className="character-selector">
      <div className="selector-groups">
        {Object.entries(characterGroups).map(([group, characters]) => (
          <div key={group} className="group">
            <h4>{group}</h4>
            <div className="character-list">
              {characters.map(char => (
                <button
                  key={char}
                  type="button"
                  onClick={() => addTag(char)}
                  className={currentTags.toLowerCase().includes(char.toLowerCase()) ? 'active' : ''}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}