package com.lucpastc.iphonian.app;

import android.annotation.SuppressLint;
import android.content.res.AssetManager;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/** @noinspection ALL*/
public class MainActivity extends AppCompatActivity {

    private WebView myWebView;
    private String pastaInternaApp;
    private static final String TAG = "IPhonian";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Ativa o Modo Imersivo de Tela Cheia total (esconde barras do Android)
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );

        // Define a pasta de dados do app (/data/data/com.lucpastc.iphonian.app/files/)
        pastaInternaApp = getFilesDir().getAbsolutePath();

        // 1. Mapeia e verifica a existência do index.html original na memória interna
        File arquivoIndex = new File(pastaInternaApp + "/index.html");
        if (!arquivoIndex.exists()) {
            try {
                Log.d(TAG, "Primeira inicialização: Copiando base do iPadian...");
                copiarAssetsParaMemoriaInterna("");
                Log.d(TAG, "Arquivos extraídos com sucesso!");
            } catch (IOException e) {
                Log.e(TAG, "Erro fatal ao copiar assets internos: ", e);
            }
        }

        // 2. Roda a verificação de arquivos .iapp na RAIZ do armazenamento do celular
        instalarNovosAppsIapp();

        // 3. Configura a WebView para rodar o ecossistema Web de forma livre
        myWebView = (WebView) findViewById(R.id.iphonianWebView);
        WebSettings webSettings = myWebView.getSettings();

        // Destrava os recursos do JavaScript e banco de dados local
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setSupportMultipleWindows(false);

        // --- Libera as travas CORS para leitura de pastas e redirecionamentos locais ---
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        // Otimização de desempenho
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        myWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Controla a navegação e redirecionamentos dentro da própria WebView
        myWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        myWebView.setWebChromeClient(new WebChromeClient());

        // 4. Inicializa o simulador direto no index.html (Tela de Carregamento)
        if (arquivoIndex.exists()) {
            myWebView.loadUrl("file://" + arquivoIndex.getAbsolutePath());
        } else {
            // Backup de segurança lendo direto do APK
            myWebView.loadUrl("file:///android_asset/index.html");
        }
    }

    // Procura novos arquivos .iapp direto na raiz do armazenamento do celular (/sdcard/iphonian_apps)
    private void instalarNovosAppsIapp() {
        File pastaOrigemIapp = new File(Environment.getExternalStorageDirectory(), "iphonian_apps");

        // Se a pasta não existir na raiz do armazenamento, o Java cria automaticamente
        if (!pastaOrigemIapp.exists()) {
            pastaOrigemIapp.mkdirs();
        }

        File[] arquivos = pastaOrigemIapp.listFiles();
        if (arquivos != null) {
            for (File arquivo : arquivos) {
                // Filtra os arquivos que terminam com .iapp
                if (arquivo.getName().endsWith(".iapp")) {
                    String nomeApp = arquivo.getName().replace(".iapp", "");
                    File pastaDestino = new File(pastaInternaApp + "/apps/" + nomeApp);

                    if (!pastaDestino.exists()) {
                        try {
                            Log.d(TAG, "Novo app detectado! Descompactando: " + nomeApp);
                            descompactarZipFalso(arquivo, pastaDestino);
                            arquivo.delete(); // Exclui o instalador para economizar espaço
                        } catch (IOException e) {
                            Log.e(TAG, "Falha ao instalar o pacote: " + nomeApp, e);
                        }
                    }
                }
            }
        }
    }

    // Copia os dados da pasta assets do projeto para a memória interna do telefone
    private void copiarAssetsParaMemoriaInterna(String path) throws IOException {
        AssetManager assetManager = getAssets();
        String[] assets = assetManager.list(path);
        if (assets.length == 0) {
            copiarArquivoIndividual(path);
        } else {
            String fullPath = pastaInternaApp + (path.equals("") ? "" : "/" + path);
            File dir = new File(fullPath);
            if (!dir.exists()) dir.mkdirs();
            for (String asset : assets) {
                copiarAssetsParaMemoriaInterna(path.equals("") ? asset : path + "/" + asset);
            }
        }
    }

    private void copiarArquivoIndividual(String filename) throws IOException {
        AssetManager assetManager = getAssets();
        InputStream in = assetManager.open(filename);
        OutputStream out = new FileOutputStream(pastaInternaApp + "/" + filename);
        byte[] buffer = new byte[4096];
        int read;
        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
        in.close();
        out.flush();
        out.close();
    }

    // Extrai o conteúdo compactado do arquivo .iapp para a pasta interna de apps
    private void descompactarZipFalso(File zipFile, File targetDirectory) throws IOException {
        ZipInputStream zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(zipFile)));
        try {
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[8192];
            while ((ze = zis.getNextEntry()) != null) {
                File file = new File(targetDirectory, ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new IOException("Falha ao estruturar diretórios: " + dir.getAbsolutePath());
                if (ze.isDirectory()) continue;
                FileOutputStream fout = new FileOutputStream(file);
                try {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally {
                    fout.close();
                }
            }
        } finally {
            zis.close();
        }
    }

    @SuppressLint("GestureBackNavigation")
    @Override
    public void onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}