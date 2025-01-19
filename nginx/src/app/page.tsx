import React from 'react';

const Home: React.FC = () => {
  return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10px', backgroundColor: '#b8e2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '10px', fontSize: '18px', fontWeight: 'bold', border: 'none', background: 'none'}}>로고위치</div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>TRIPSTORY</h1>
          </div>
          <div>
            <input
                type="text"
                placeholder="도시 검색"
                style={{
                  padding: '5px',
                  fontSize: '14px',
                  border: '1px solid #ccc',
                  borderRadius: '20px',
                  marginRight: '800px',
                }}
            />
            <button style={{ padding: '5px 10px', fontSize: '16px', backgroundColor: '#ffcb00', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ 새로운 게시물 만들기</button>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'row', padding: '20px', gap: '20px' }}>
          {/* Left Column: Trip Cards */}
          <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Today's Trip</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Trip Cards */}
              {['프랑스 파리에서의 추억', '도쿄는 아름답다.', 'The soul of Seoul', 'Diamond Bridge in Busan'].map((title, index) => (
                  <div
                      key={index}
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#ffffff',
                      }}
                  >
                    <div style={{ height: '200px', backgroundColor: '#eaeaea' }}>이미지</div>
                    <div style={{ padding: '10px' }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '16px' }}>{title}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#555' }}>⭐ {Math.floor(Math.random() * 5000) + 100}k</span>
                        <span style={{ fontSize: '14px', color: '#777' }}>user_{index + 1}</span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Right Column: 명예의 전당 */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: '#e8f5e9',
                    borderRadius: '10px',
                    padding: '10px',
                    boxShadow: '0 4px 6px rgba(50, 150, 250, 0.5)',
                    maxHeight: 'fit-content',
                    position: 'sticky',
                    top: '20px',
                }}
          >
            <h3 style={{ margin: '0 0 10px 0', textAlign: 'center', color: '#333' }}>👑 명예의 전당 👑</h3>
            <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
              {['user_1', 'user_102', "I'm_girl", 'user_132'].map((user, index) => (
                  <li key={index} style={{ marginBottom: '5px', fontSize: '16px', color: '#555' }}>
                    {index + 1 === 1 && '🥇'}
                    {index + 1 === 2 && '🥈'}
                    {index + 1 === 3 && '🥉'}
                    {index + 1 > 3 && '🏅'} {user}
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Home;
