'use client'
import { useAuthContext } from '../../context/AuthContext'
import { useState } from 'react'
import { NavigationBarData } from '../../../public/staticData/NavigationBarData'
import { removeToken, removeUserId } from '../../helpers'
import { useRouter } from 'next/navigation'
import useDeviceType from '../../hooks/useDeviceType'
import { Nav, Dropdown, SideSheet } from '@douyinfe/semi-ui'
import { IconUser } from '@douyinfe/semi-icons'
import { FiMenu } from 'react-icons/fi'
import { Button } from 'flowbite-react'
import Image from 'next/image'
import Link from 'next/link'
import { replace } from 'formik'

const NavbarWithCTAButton = () => {
  const { user } = useAuthContext()
  const router = useRouter()
  const deviceType = useDeviceType()
  const [visible, setVisible] = useState(false)

  const handleLogout = () => {
    removeToken()
    removeUserId()
    router.push('/auth/login')
    location.reload()
  }

  const show = () => {
    setVisible(true)
  }
  const handleCancel = e => {
    setVisible(false)
  }

  return (
    <div className='w-full'>
      <Nav
        mode={'horizontal'}
        header={{
          text: (
            <Link
              href='/'
              replace
              className='text-xl !text-light-content-neutral-1'
            >
              HighFlix
            </Link>
          ),
        }}
        items={
          deviceType !== 'mobile'
            ? NavigationBarData.map(item => ({
                text: (
                  <Link
                    href={item.href}
                    replace
                    className='!text-light-content-neutral-1'
                  >
                    {item.name}
                  </Link>
                ),
              }))
            : []
        }
        footer={
          deviceType !== 'mobile' ? (
            <>
              {user ? (
                <Dropdown
                  position='bottomRight'
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item>{`Hello, ${user?.username}`}</Dropdown.Item>
                      <Dropdown.Divider></Dropdown.Divider>
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                >
                  <Image
                    src={`${
                      user.avatar_url
                        ? user.avatar_url
                        : 'https://i.pinimg.com/564x/26/86/c1/2686c15c6684eb353ebf7a990bf46d98.jpg'
                    }`}
                    alt='User Image'
                    width={50}
                    height={50}
                    className='rounded-full !w-[50px] !h-[50px]'
                  />
                </Dropdown>
              ) : (
                <>
                  <Link href={'/auth/login'}>
                    <Button color='text-light-content-neutral-1' size='sm'>
                      Login
                    </Button>
                  </Link>
                  <Link href={'/auth/register'}>
                    <Button color='dark' size='sm'>
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <FiMenu onClick={show} />
              <SideSheet visible={visible} onCancel={handleCancel} width={300}>
                <Nav mode={'vertical'}>
                  {user && (
                    <Nav.Sub
                      itemKey='user'
                      icon={<IconUser />}
                      text={`${user?.username}`}
                    >
                      <Nav.Item
                        itemKey={'logout'}
                        text='Log out'
                        onClick={handleLogout}
                      />
                    </Nav.Sub>
                  )}
                  {NavigationBarData.map((item, index) => (
                    <Nav.Item
                      key={index}
                      itemKey={index}
                      text={item.name}
                      link={item.href}
                    />
                  ))}
                  {!user && (
                    <>
                      <Nav.Item
                        itemKey='login'
                        text='Login'
                        link='/auth/login'
                      />
                      <Nav.Item
                        itemKey='login'
                        text='Login'
                        link='/auth/register'
                      />
                    </>
                  )}
                </Nav>
              </SideSheet>
            </>
          )
        }
      />
    </div>
  )
}

export default NavbarWithCTAButton
