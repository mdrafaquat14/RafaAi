import logo from '../assets/rafaai-logo.png'

export function Logo({ small = false }: { small?: boolean }) {
  return <img className={small ? 'brand-logo small' : 'brand-logo'} src={logo} alt="RafaAi" />
}
