import Button from '@/components/Button'
import Icon from '@/components/Icon'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(40px,8vw,96px)] pb-[clamp(80px,14vw,160px)]">
      <p className="m-0 mb-6 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
        Error 404
      </p>
      <h1 className="m-0 font-block text-[clamp(32px,10.2vw,116px)] leading-[1.06] font-normal uppercase text-balance">
        This node
        <br />
        <span className="highlight">isn't linked.</span>
      </h1>
      <p className="mt-8 mb-0 text-[clamp(18px,2vw,21px)] text-muted">
        The page you're looking for doesn't exist.
      </p>
      <div className="mt-10">
        <Button href="/" primary>
          <Icon name="back" />
          Back to knode.md
        </Button>
      </div>
    </section>
  )
}
