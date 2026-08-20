import Image from 'next/image'

export default function MobileLoading() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 bg-[#F7F5F0] px-4 select-none">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-white p-2.5 shadow-sm border border-[rgba(33,26,18,0.08)]">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-[20px] bg-[#DF8821]/15 opacity-70" />
        <Image
          src="/agrivil-mark.svg"
          alt="AgriVil Loading"
          width={40}
          height={40}
          className="relative z-10 h-full w-full object-contain animate-pulse"
          priority
        />
      </div>
      <p className="text-[11.5px] font-bold text-[#5C5247] tracking-wide">
        Loading fresh harvest…
      </p>
    </div>
  )
}
