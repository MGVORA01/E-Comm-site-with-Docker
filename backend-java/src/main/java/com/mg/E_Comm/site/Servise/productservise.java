package com.mg.E_Comm.site.Servise;

import com.mg.E_Comm.site.model.Product;
import com.mg.E_Comm.site.repo.productrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class productservise {

    @Autowired
    public productrepo productrepo;

    public List<Product> getAllproduct()
    {
        return productrepo.findAll();
    }

    public Product findproduct(int id) {
        return productrepo.findById(id).orElse(new Product());
    }

    public Product addOrupdateproduct(Product product, MultipartFile image) throws IOException {

        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());

        return productrepo.save(product);
    }

    public void deleteproduct(int id) {
         productrepo.deleteById(id);
    }

    public List<Product> searchproduct(String keyword) {
        return productrepo.searchProduct(keyword);
    }
}
