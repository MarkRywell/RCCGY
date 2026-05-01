type HeaderProps = {
  hidden?: boolean;
}

function Header({ hidden = false }: HeaderProps) {
  return (
    <header
      className={[
        'bg-primary text-white px-4 sm:px-6 lg:px-20',
        'flex items-start sm:items-center justify-between gap-3 text-xs',
        // animate collapse/expand
        'overflow-hidden will-change-[max-height,opacity,transform]',
        'transition-[max-height,opacity,transform] duration-300 ease-in-out',
        hidden
          ? 'max-h-0 py-0 opacity-0 -translate-y-2 pointer-events-none'
          : 'max-h-24 py-2 sm:py-1 opacity-100 translate-y-0',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        <a
          href="mailto:rannncrewcgy@gmail.com"
          className="inline-flex items-center gap-2 text-sm underline-offset-4"
          aria-label="Email rannncrewcgy@gmail.com"
        >
          <svg
            className="h-4 w-4 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          <span>rannncrewcgy@gmail.com</span>
        </a>

        <div className="inline-flex items-center gap-2 text-sm">
          <svg
            className="h-4 w-4 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 2c-3.86 0-7 3.14-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
          </svg>
          {/*
            < 425px: show full address (can wrap)
            425px–767px: show short address to keep the header on one row
            >= 768px: show full address again
          */}
          <span className="inline xs:hidden md:inline">Cagayan de Oro City, Philippines, 9000</span>
          <span className="hidden xs:inline md:hidden">CDO, PH</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <a
          href="https://www.facebook.com/profile.php?id=61565994238694"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook profile"
          className="inline-flex items-center hover:opacity-80"
        >
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 shrink-0 text-white"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M21.95 5.005l-3.306-.004c-3.206 0-5.277 2.124-5.277 5.415v2.495H10.05v4.515h3.317l-.004 9.575h4.641l.004-9.575h3.806l-.003-4.514h-3.803v-2.117c0-1.018.241-1.533 1.566-1.533l2.366-.001.01-4.256z" />
          </svg>
        </a>

        <a
          href="https://www.instagram.com/rannnccgy"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram profile"
          className="inline-flex items-center hover:opacity-80"
        >
          <svg
            viewBox="0 0 28 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 shrink-0"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
              fill="currentColor"
            />
            <path
              d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </header>
  )
}

export default Header
