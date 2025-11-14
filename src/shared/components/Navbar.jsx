// src/shared/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeAuth,
  logout,
  fetchUserDetails
} from '../../features/auth/state/authSlice'
import {
  BookOpen,
  BarChart3,
  Home,
  LogOut,
  Menu,
  FileText,
  Users
} from 'lucide-react'

const Navbar = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Initialize auth state from localStorage after component mounts
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    // Fetch user details if authenticated but user data not loaded
    if (isMounted && isAuthenticated && !user && !loading) {
      dispatch(fetchUserDetails())
    }
  }, [isMounted, isAuthenticated, user, loading, dispatch])

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!isMounted) {
    return (
      <div className="navbar bg-base-100 shadow-lg px-4 lg:px-8">
        <div className="navbar-start">
          <button
            onClick={() => handleNavigation('/')}
            className="btn btn-ghost normal-case text-xl font-bold"
          >
            <span className="text-primary">Agent</span>
            <span>Smartly</span>
          </button>
        </div>
        <div className="navbar-center hidden lg:flex"></div>
        <div className="navbar-end gap-2"></div>
      </div>
    )
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const handleNavigation = (path) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return router.pathname === path
  }

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 lg:px-8">
      <div className="navbar-start">
        {/* Logo */}
        <button
          onClick={() => handleNavigation('/')}
          className="btn btn-ghost normal-case text-xl font-bold"
        >
          <span className="text-primary">Agent</span>
          <span>Smartly</span>
        </button>
      </div>

      <div className="navbar-center hidden lg:flex">
        {/* Desktop Menu */}
        <ul className="menu menu-horizontal px-1 gap-2">
          {isAuthenticated ? (
            <>
              <li>
                <button
                  onClick={() => handleNavigation('/learning/practice')}
                  className={isActive('/learning/practice') ? 'active' : ''}
                >
                  <BookOpen className="h-5 w-5" />
                  Practice
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/learning/progress')}
                  className={isActive('/learning/progress') ? 'active' : ''}
                >
                  <BarChart3 className="h-5 w-5" />
                  Progress
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/community/study-group')}
                  className={isActive('/community/study-group') ? 'active' : ''}
                >
                  <Users className="h-5 w-5" />
                  Study Group
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className={isActive('/') ? 'active' : ''}
                >
                  <Home className="h-5 w-5" />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/community/study-group')}
                  className={isActive('/community/study-group') ? 'active' : ''}
                >
                  <Users className="h-5 w-5" />
                  Study Group
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {isAuthenticated ? (
          <>
            {/* User Dropdown - Desktop */}
            <div className="dropdown dropdown-end hidden lg:block">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {user?.username
                      ? user.username.charAt(0).toUpperCase()
                      : 'U'}
                  </span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>{user?.username || 'User'}</span>
                </li>
                {user?.email && (
                  <li className="disabled">
                    <span className="text-xs opacity-60">{user.email}</span>
                  </li>
                )}
                <div className="divider my-0"></div>
                <li>
                  <button
                    onClick={() => handleNavigation('/learning/practice')}
                  >
                    <BookOpen className="h-4 w-4" />
                    Practice
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation('/learning/exam')}>
                    <FileText className="h-4 w-4" />
                    Exam
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/learning/progress')}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Progress
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/community/study-group')}
                  >
                    <Users className="h-4 w-4" />
                    Study Group
                  </button>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button - Authenticated */}
            <div className="dropdown dropdown-end lg:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <Menu className="h-5 w-5" />
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>{user?.username || 'User'}</span>
                </li>
                {user?.email && (
                  <li className="disabled">
                    <span className="text-xs opacity-60">{user.email}</span>
                  </li>
                )}
                <div className="divider my-0"></div>
                <li>
                  <button
                    onClick={() => handleNavigation('/learning/practice')}
                  >
                    <BookOpen className="h-4 w-4" />
                    Practice
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/learning/progress')}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Progress
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/community/study-group')}
                  >
                    <Users className="h-4 w-4" />
                    Study Group
                  </button>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Not Authenticated - Desktop */}
            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => handleNavigation('/auth/login')}
                className="btn btn-ghost"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation('/auth/signup')}
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>

            {/* Not Authenticated - Mobile */}
            <div className="dropdown dropdown-end lg:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <Menu className="h-5 w-5" />
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={() => handleNavigation('/')}>
                    <Home className="h-4 w-4" />
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/community/study-group')}
                  >
                    <Users className="h-4 w-4" />
                    Study Group
                  </button>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={() => handleNavigation('/auth/login')}>
                    Login
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation('/auth/signup')}>
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
