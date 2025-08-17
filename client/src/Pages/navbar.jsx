import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { handleRate, logOut } from '@/Api/authApi';
import { Button } from '@/components/ui/button';
import { Dialog } from '@headlessui/react';

const Navbar = () => {
  const { role, setRole,userId } = useContext(UserContext);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [rating, setRating] = useState(null);

  const navigate = useNavigate();

  if (!role) {
    setRole(localStorage.getItem('role'));
  }

  const handleLogout = async () => {
    try {
      await logOut();
      setRole(null);
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.log('Logout failed:', error);
    }
  };

  const handleRatingSubmit = async() => {
    console.log('Rating submitted:', rating);
    setIsRatingOpen(false);
    
    try{
      const response = await handleRate(rating,userId)
    }catch(error){
      console.log(error)
    }
  };

  return (
    <>
      <nav className="bg-[#030609] py-4 px-6 md:px-12 flex items-center justify-between shadow-md">
        {/* Left: Logo */}
        <div className="text-2xl font-bold text-yellow-600">L&F</div>

        {/* Middle: Links */}
        <div className="flex-grow flex justify-center space-x-4 md:space-x-6">
          <Link
            to="/"
            className="text-white hover:text-blue-600 font-semibold transition-colors duration-300"
          >
            Home
          </Link>

          {role === 'admin' && (
            <>
              <Link to="/reports" className="text-white hover:text-blue-600 font-semibold transition-colors duration-300">Reports</Link>
              
            </>
          )}

          {role === 'user' && (
            <>
              <Link to="/post" className="text-white hover:text-blue-600 font-semibold transition-colors duration-300">Post Lost/Found Item</Link>
              <Link to="/item-list" className="text-white hover:text-blue-600 font-semibold transition-colors duration-300">Items</Link>
              <Link to="/chat" className="text-white hover:text-blue-600 font-semibold transition-colors duration-300">All Chats</Link>
               <Link to="/verification" className="text-white hover:text-blue-600 font-semibold transition-colors duration-300">Reports</Link>
              <button
            onClick={() => setIsRatingOpen(true)}
            className="text-white hover:text-blue-600 font-semibold transition-colors duration-300"
          >
            Rate Us
          </button>
            </>
          )}

          {/* New Rate Us link */}
        </div>

        {/* Right: Button */}
        <div>
          {role ? (
            <Button
              onClick={handleLogout}
              className="bg-transparent text-white font-semibold px-4 py-2 rounded-md"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="text-white font-semibold px-4 py-2 rounded-md">Login</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Rating Modal */}
      <Dialog open={isRatingOpen} onClose={() => setIsRatingOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold">Rate Us</Dialog.Title>
            <p className="text-gray-700">How would you rate your experience?</p>
            <div className="flex justify-center space-x-2">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className={`w-8 h-8 rounded-full font-medium ${
                    rating === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-black hover:bg-blue-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsRatingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRatingSubmit} disabled={!rating}>
                Submit
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Navbar;
