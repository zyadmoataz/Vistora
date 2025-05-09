import Add from '@/components/Add'
import CustomizeProducts from '@/components/CustomizeProducts'
import ProductImages from '@/components/ProductImages'
import { wixClientServer } from '@/lib/wixClientServer';
import { notFound } from 'next/navigation';

export default async function SinglePage({params}:{params:{slug:string}}) {

    const wixClient = await wixClientServer();
    const res = await wixClient.products.queryProducts().eq("slug",params.slug).find();
    const product = res.items[0];
    
    // if we entered anything in the url and changed the page we are on return me to not found page
    if(!res.items[0])
      {
        return notFound();
      }
      
      // console.log(product?.productOptions);
  
    // console.log(product.variants);
    // [
    //   {
    //     choices: {},
    //     variant: {
    //       priceData: [Object],
    //       convertedPriceData: [Object],
    //       weight: 0,
    //       sku: '671253175371',
    //       visible: true
    //     },
    //     stock: { trackQuantity: false, inStock: true },
    //     _id: '00000000-0000-0000-0000-000000000000'
    //   }
    //]
  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
      {/* Image Container */}
      <div className='w-full lg:w-1/2 lg:sticky top-[100px] h-max'>  {/* height of nav bar is 100 px */}
        <ProductImages items={product.media?.items} />
      </div>
      {/* Text Container */}
      <div className='w-full lg:w-1/2 flex flex-col gap-6'>
        <h1 className='text-4xl font-medium'>{product.name}</h1>
        <p className='text-gray-500'>{product.description}</p>
      <div className='h-[2px] bg-gray-100'/>   {/* Line */}  
        {/* if there is no discount show nothing */}
        {
        product.price?.price ===product.price?.discountedPrice ? ( <h2 className='text-2xl font-medium'>$ {product.price?.price} </h2>):(
          <div className='flex items-center gap-4'>
            <h3 className='text-xl line-through text-gray-500'>$ {product.price?.price} </h3>
            <h2 className='text-2xl font-medium'>$ {product.price?.discountedPrice} </h2>
          </div>
        )}
      <div className='h-[2px] bg-gray-100'/>   {/* Line */}
      {product.variants && product.productOptions ?
        (
          <CustomizeProducts productId={product._id!} variants={product.variants} productOptions={product.productOptions}/>
        ):
        (
          // if we dont have any option then chooce the default variant
          <Add productId={product._id!} variantId="00000000-0000-0000-0000-000000000000" stockNumber={product.stock?.quantity || 0}/>
        )
        }
      {/* <Add productId={product._id} variantId="00000000-0000-0000-0000-000000000000"/> */}
      <div className='h-[2px] bg-gray-100'/>   {/* Line */}
      {   product.additionalInfoSections?.map((section:any)=>(
        <div className='text-sm' key={section.title}>
          <h4 className='font-medium mb-4'>{section.title}</h4>
          <p>{section.description}</p>
        </div>
        ))     
      }
      </div>
    </div>
  )
}
