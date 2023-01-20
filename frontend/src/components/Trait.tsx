export const Trait: React.FC<{ imgURL: string }> = ({ imgURL }) => {

  return <div className='border m-2 p-2 flex rounded border-gray-800 bg-zinc-800 drop-shadow-lg'>
    <img src={imgURL} alt='trait' />
    <p className="p-1 absolute top-1 left-1/2 -translate-x-1/2">Trait A #1</p>
    <button className="p-1 absolute bottom-1 border left-1/2 -translate-x-1/2 rounded">Enable trait</button>
  </div>
}